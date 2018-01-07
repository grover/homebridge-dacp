"use strict";

const EventEmitter = require('events').EventEmitter;
const util = require('util');

const DacpConnection = require('./DacpConnection');

class DacpClient extends EventEmitter {

  constructor(log, settings) {
    super();

    this.log = log;
    this._settings = settings;

    // Pool of connections to actually use
    this._connections = {};
  }

  async connect(settings) {
    if (!!this._settings) {
      throw new Error('Can\'t connect an already active client.');
    }
    this._settings = settings;

    return await this._withConnection(this.STATUS_CONNECTION, async (connection) => {
      const serverInfo = await connection.sendRequest('server-info');
      if (!serverInfo || !serverInfo.msrv) {
        throw new Error("Missing server info response container");
      }

      this.emit('connected');
      return serverInfo.msrv;
    });
  }

  async requestPlayStatus() {
    const self = this;

    return await this._withConnection(this.STATUS_CONNECTION, async (connection) => {
      const response = await connection.sendRequest(
        'ctrl-int/1/playstatusupdate',
        { 'revision-number': this._revisionNumber });

      if (response.cmst === undefined || response.cmst.cmsr === undefined) {
        const e = new Error('Missing revision number in play status update response');
        e.response = response;
        throw e;
      }

      this._revisionNumber = response.cmst.cmsr;
      return response.cmst;
    });
  }

  async getProperty(prop) {
    return await this._withConnection(this.CONTROL_CONNECTION, async (connection) => {
      const response = await connection.sendRequest(
        'ctrl-int/1/getproperty',
        { 'properties': prop });

      if (!response || !(response.cmgt || response.cmst)) {
        throw new Error("Missing get property response container");
      }

      return response.cmgt || response.cmst;
    });
  }

  async setProperty(prop, value) {
    return await this._withConnection(this.CONTROL_CONNECTION, async (connection) => {
      const data = {};
      data[prop] = value;
      return connection.sendRequest('ctrl-int/1/setproperty', data);
    });
  }

  async play() {
    return await this._withConnection(this.CONTROL_CONNECTION, async (connection) => {
      return connection.sendRequest('ctrl-int/1/playpause');
    });
  }

  async nextTrack() {
    return await this._withConnection(this.CONTROL_CONNECTION, async (connection) => {
      return connection.sendRequest('ctrl-int/1/nextitem');
    });
  }

  async prevTrack() {
    return await this._withConnection(this.CONTROL_CONNECTION, async (connection) => {
      return connection.sendRequest('ctrl-int/1/previtem');
    });
  }

  async _withConnection(type, action) {
    try {
      let c = this._connections[type];
      if (!c) {
        this.log(`Creating ${type} connection to ${this._settings.host}`);
        c = await this._createConnection(type);
        this._connections[type] = c;
        c.on('failed', this._onConnectionFailed.bind(this, type));
      }

      return await action(c);
    }
    catch (e) {
      this._reset();

      this.emit('failed', e);
      throw e;
    }
  }

  async _createConnection(type) {
    const c = new DacpConnection(this._settings.host, this._settings.pairing);
    this._sessionId = await c.connect(this._sessionId);
    return c;
  }

  _onConnectionFailed(type, error) {
    this.log(`Connection ${type} failed with error ${util.inspect(error)}`);
    this._reset();

    this.emit('failed', error);
  }

  _reset() {
    this._connections.forEach(connection => {
      connection.close();
    });
    this._connections = {};
    this._settings = undefined;
    this._sessionId = undefined;
  }
};

DacpClient.prototype.STATUS_CONNECTION = 'status';
DacpClient.prototype.CONTROL_CONNECTION = 'properties';

module.exports = DacpClient;