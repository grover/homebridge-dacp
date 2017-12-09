"use strict";

const EventEmitter = require('events').EventEmitter;
const request = require('request');
const daap = require('../daap/Decoder');

class DacpClient extends EventEmitter {

  constructor(log) {
    super();

    this.log = log;
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

    return this.sendRequest('login', { 'pairing-guid': '0x' + options.pairing }).then(response => {
      if (response.mlog && response.mlog.mlid) {
        this._sessionId = response.mlog.mlid;
        this.log(`Session ID ${this._sessionId}`);

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
    if (this._readyState !== 'connected') {
      this._readyState = 'disconnected';
      return;
    }

    this.sendRequest('logout', {})
      .then(() => {
        this._sessionId = undefined;
        this._readyState = 'disconnected';
      })
      .catch(() => {
        this._sessionId = undefined;
        this._readyState = 'disconnected';
      });
  }

  async getUpdate() {
    if (this._readyState !== 'connected') {
      throw new Error('Can\'t send requests to disconnected DACP servers.');
    }

    const self = this;
    return this.sendRequest('ctrl-int/1/playstatusupdate', { 'revision-number': this._revisionNumber }).catch(error => {
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
      return this.sendRequest('server-info').catch(error => {
        reject(error);
      }).then(response => {
        resolve(response);
      });
    });
  }

  async getProperty(prop) {
    return this.sendRequest('ctrl-int/1/getproperty', { 'properties': prop });
  }

  async setProperty(prop, value) {
    const data = {};
    data[prop] = value;
    return this.sendRequest('ctrl-int/1/setproperty', data);
  }

  async sendRequest(relativeUri, data) {

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
          this.emit('error', error);
          reject(error);
          return;
        }

        try {
          response = daap.decode(response.body);
        }
        catch (e) {
          this.emit('error', error);
          reject(e);
          return;
        }

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