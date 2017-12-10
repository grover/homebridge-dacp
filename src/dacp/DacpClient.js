"use strict";

const EventEmitter = require('events').EventEmitter;
const request = require('request');
const daap = require('../daap/Decoder');

class DacpClient extends EventEmitter {

  constructor(log) {
    super();

    this.log = log;

    /**
     * 'disconnected': Disconnected
     * 'authenticating': Connecting to the DACP server
     * 'connected': Connected to the DACP server
     */
    this._state = 'disconnected';
  }

  async login(options) {
    if (this._state !== 'disconnected') {
      throw new Error('Can\'t login on an already active client.');
    }

    this._setReadyState('authenticating', options);
    this._host = options.host;

    return this.sendRequest('login', { 'pairing-guid': '0x' + options.pairing })
      .then(response => {
        if (response.mlog && response.mlog.mlid) {
          this._sessionId = response.mlog.mlid;

          this._revisionNumber = 1;
          this._setReadyState('connected', this._sessionId);
        }
        else {
          this._setReadyState('failed', 'Missing session ID in authentication response.');
        }
      });
  }

  async requestPlayStatus() {
    const self = this;

    return Promise.resolve().then(() => {
      this._assertConnected();
      return this.sendRequest('ctrl-int/1/playstatusupdate', { 'revision-number': this._revisionNumber });
    }).then(response => {
      if (!response.hasOwnProperty('cmst') || !response.cmst.hasOwnProperty('cmsr')) {
        const e = new Error('Missing revision number in play status update response');
        e.response = response;
        throw e;
      }

      this._revisionNumber = response.cmst.cmsr;
      return response;
    }).catch(e => {
      this._setReadyState('failed', e);
      throw e;
    });
  }

  async getServerInfo() {
    return Promise.resolve().then(() => {
      this._assertConnected();
      return this.sendRequest('server-info');
    }).catch(e => {
      this._setReadyState('failed', e);
      throw e;
    });

  }

  async getProperty(prop) {
    return Promise.resolve().then(() => {
      this._assertConnected();
      return this.sendRequest('ctrl-int/1/getproperty', { 'properties': prop });
    }).then(response => {
      if (!response || !response.cmgt) {
        throw new Error("Missing get property response container");
      }

      return response.cmgt;
    }).catch(e => {
      this._setReadyState('failed', e);
      throw e;
    });
  }

  async setProperty(prop, value) {
    return Promise.resolve().then(() => {
      this._assertConnected();

      const data = {};
      data[prop] = value;
      return this.sendRequest('ctrl-int/1/setproperty', data);
    }).catch(e => {
      this._setReadyState('failed', e);
      throw e;
    });
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

      // this.log(`Request ${JSON.stringify(options)}`);
      request(options, (error, response) => {
        // this.log(`Done ${JSON.stringify(options)}`);
        if (error || (response && response.statusCode >= 300)) {
          const e = {
            error: error,
            response: response,
            options: options
          };

          reject(e);
          return;
        }

        try {
          response = daap.decode(response.body);
        }
        catch (e) {
          this.emit('failed', error);
          reject(e);
          return;
        }

        resolve(response);
      });
    });
  }

  _assertConnected() {
    if (this._readyState !== 'connected') {
      throw new Error('Can\'t send requests to disconnected DACP servers.');
    }
  }

  _setReadyState(readyState) {
    if (readyState === 'failed') {
      this._sessionId = undefined;
      this._revisionNumber = 1;
    }

    if (readyState === this._readyState) {
      return;
    }

    this._readyState = readyState;

    const args = Array.from(arguments).slice(1);
    this.emit(readyState, ...args);
  }
};

module.exports = DacpClient;