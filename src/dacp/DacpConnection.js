'use strict';

const http = require('http');
const EventEmitter = require('events').EventEmitter;
const SequentialTaskQueue = require('sequential-task-queue').SequentialTaskQueue;
const request = require('request');
const URL = require('url');

const util = require('util');
const debug = require('debug')('dacp');

const daap = require('../daap/Decoder');

class DacpConnection extends EventEmitter {

  constructor(host, pairing) {
    super();

    // Force all the requests to stay on the same socket
    this._agent = new http.Agent({
      keepAlive: true,
      maxFreeSockets: 1,
      maxSockets: 1
    });

    this._host = host;
    this._pairing = pairing;

    this._sessionId = undefined;

    /**
     * 'disconnected': Disconnected
     * 'authenticating': Connecting to the DACP server
     * 'connected': Connected to the DACP server
     */
    this._state = 'disconnected';

    // Force all requests to happen in order
    this._taskQueue = new SequentialTaskQueue();
  }

  async connect(sessionId) {
    if (this._state !== 'disconnected') {
      throw new Error('Can\'t login on an already active client.');
    }

    if (sessionId) {
      this._sessionId = sessionId;
      this._setState('connected', this._sessionId);
      return this._sessionId;
    }

    this._setState('authenticating');
    const response = await this._sendRequest('login', { 'pairing-guid': '0x' + this._pairing });
    if (response.mlog && response.mlog.mlid) {
      this._sessionId = response.mlog.mlid;
      console.log(`Established connection to ${this._host} with session ID ${this._sessionId}`);

      this._revisionNumber = 1;
      this._setState('connected', this._sessionId);
      return this._sessionId;
    }
    else {
      throw new Error('Missing session ID in authentication response');
    }
  }

  close() {
    // Not sure what to do here yet.
  }

  async sendRequest(relativeUri, data, body) {
    return this._taskQueue.push(() => {
      this._assertConnected();
      return this._sendRequest(relativeUri, data, body);
    });
  }

  _assertConnected() {
    if (this._state === 'disconnected') {
      throw new Error('Can\'t send requests to disconnected DACP servers.');
    }
  }

  async _sendRequest(relativeUri, data, body) {
    return new Promise((resolve, reject) => {
      const uri = `http://${this._host}/${relativeUri}`;
      data = data || {};

      if (this._sessionId) {
        data['session-id'] = this._sessionId;
      }

      let qs = '';
      for (let key of Object.keys(data)) {
        qs += `${qs.length > 0 ? '&' : '?'}${key}=${data[key]}`;
      }

      const url = new URL.URL(uri);
      url.search = qs;

      const options = {
        encoding: null,
        url: url,
        headers: {
          'Accept': '*/*',
          // 'Accept-Encoding': 'gzip',
          'Viewer-Only-Client': '1',
          'Client-DAAP-Version': '3.12',
          'Client-ATV-Sharing-Version': '1.2',
          'Client-iTunes-Sharing-Version': '3.10',
          'User-Agent': 'TVRemote/186 CFNetwork/808.1.4 Darwin/16.1.0'
        },
        agent: this._agent
      };

      if (body) {
        options.body = daap.encode(body);
      }

      request(options, (error, response) => {
        // this.log(`Done ${JSON.stringify(options)}`);
        if (error || (response && response.statusCode >= 300)) {
          const e = {
            error: error,
            response: response,
            options: options
          };

          if (response) {
            debug(`${url} failed: ${response.statusCode}`);
          }

          if (error) {
            debug(`${url} failed with error: ${error}`);
            this.emit('failed', error);
          }

          reject(e);
          return;
        }

        try {
          if (response.headers['content-type'] === 'application/x-dmap-tagged') {
            response = daap.decode(response.body);
            debug(`${url} responded: ${util.inspect(response)}`);
          }
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

  _setState(state) {
    if (state === 'failed') {
      this._sessionId = undefined;
      this._revisionNumber = 1;
    }

    if (state === this._state) {
      return;
    }

    this._state = state;

    const args = Array.from(arguments).slice(1);
    this.emit(state, ...args);
  }
}

module.exports = DacpConnection;
