"use strict";

const EventEmitter = require('events').EventEmitter;
const request = require('request');
const daap = require('../daap/Decoder');

class DacpClient extends EventEmitter {

  constructor() {
    super();

    this._readyState = 'disconnected';
    this._revisionNumber = 1;
  }

  /**
   * 'disconnected': Disconnected
   * 'authenticating': Connecting to the DACP server
   * 'connected': Connected to the DACP server
   */
  get readyState() {
    return this._readyState;
  }

  async login(options) {
    if (this._readyState != 'disconnected') {
      throw new Error('Can\'t login on an already active client.');
    }

    this._setReadyState('authenticating');
    this._host = options.host;

    return this._sendRequest('login', { 'pairing-guid': '0x' + options.pairing }).then(response => {
      if (response.mlog && response.mlog.mlid) {
        this._sessionId = response.mlog.mlid;
        this._setReadyState('connected');
        this._revisionNumber = 1;
      }
      else {
        this.emit('error', 'MLID is missing.');
        this._setReadyState('disconnected');
      }
    });
  }

  logout() {
    if (this._readyState != 'connected') {
      throw new Error('Can\'t disconnect a client that\'s not connected.');
    }

    this._sendRequest('logout', {})
      .then(() => {
        this._sessionId = undefined;
      })
      .catch(() => {
        this._sessionId = undefined;
      });
  }

  async getUpdate() {
    if (this._readyState !== 'connected') {
      throw new Error('Can\'t send requests to disconnected DACP servers.');
    }

    const self = this;
    return this._sendRequest('ctrl-int/1/playstatusupdate', { 'revision-number': this._revisionNumber }).catch(error => {
      this._revisionNumber = 1;
      return self.getUpdate();
    }).then(response => {
      if (response.cmst && response.cmst.cmsr) {
        self._revisionNumber = response.cmst.cmsr;
      }
      else {
        self._revisionNumber++;
      }
      return response;
    });
  }

  async getServerInfo() {
    return new Promise((resolve, reject) => {
      return this._sendRequest('server-info').catch(error => {
        reject(error);
      }).then(response => {
        resolve(response);
      });
    });
  }

  async sendRequest() {
    if (this._readyState != 'connected') {
      throw new Error('Can\'t send requests to the client.');
    }
  }

  async _sendRequest(relativeUri, data) {

    return new Promise((resolve, reject) => {

      const uri = `http://${this._host}/${relativeUri}`;
      data = data || {};

      if (this._sessionId) {
        data['session-id'] = this._sessionId;
      }

      var options = {
        encoding: null,
        url: `http://${this._host}/${relativeUri}`,
        qs: data,
        headers: {
          'Viewer-Only-Client': '1'
        }
      };

      request(options, function (error, response) {
        if (error) {
          reject(error);
        }

        response = daap.decode(response.body);
        resolve(response);
      });
    });
  }

  _setReadyState(readyState) {
    this._readyState = readyState;
    this.emit('readyState', this._readyState);
  }
};

module.exports = DacpClient;