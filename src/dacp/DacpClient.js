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
    this._connections = [];
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

      await this.getDatabases();

      this.emit('connected');
      return serverInfo.msrv;
    });
  }

  disconnect() {
    this._reset();
  }

  async getDatabases() {
    return await this._withConnection(this.STATUS_CONNECTION, async (connection) => {
      const response = await connection.sendRequest('databases');
      this.log(`Databases: ${JSON.stringify(response)}`);

      if (response.avdb && response.avdb.mlcl && response.avdb.mlcl[0]) {
        this._databaseId = response.avdb.mlcl[0].miid;
        this._databasePersistentId = response.avdb.mlcl[0].mper;
      }
    });
  }


  async queue(name) {
    return await this._withConnection(this.CONTROL_CONNECTION, async (connection) => {

      const playlist = await this.getItem(name);
      if (playlist && playlist.miid) {
        await this.clearNowPlayingQueue();

        const response2 = await connection.sendRequest('ctrl-int/1/playqueue-edit', {
          'command': 'add',
          'query': `'dmap.itemid:${playlist.miid}'`,
          'query-modifier': 'containers',
          'mode': 3
        });
        this.log(JSON.stringify(response2));
      }
    });
  }

  async getItem(name) {
    return await this._withConnection(this.CONTROL_CONNECTION, async (connection) => {
      const response = await connection.sendRequest(`databases/${this._databaseId}/containers`, {
        meta: 'all',
        query: `dmap.itemname:${name}`
      });

      if (response && response.aply) {
        if (response.aply.mrco > 0) {
          return response.aply.mlcl.find(mlit => mlit.minm === name);
        }
      }

      return undefined;
    });
  }

  async clearNowPlayingQueue() {
    return await this._withConnection(this.CONTROL_CONNECTION, async (connection) => {
      const response = await connection.sendRequest('ctrl-int/1/playqueue-edit', {
        'command': 'clear',
        'mode': '0x6D61696E'
      });
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

  async playQueue() {
    return await this._withConnection(this.CONTROL_CONNECTION, async (connection) => {
      return connection.sendRequest('ctrl-int/1/playqueue-edit', {
        'command': 'playnow',
        'index': 1
      });
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
    this._connections = [];
    this._settings = undefined;
    this._sessionId = undefined;
    this._databaseId = undefined;
  }
};

DacpClient.prototype.STATUS_CONNECTION = 'status';
DacpClient.prototype.CONTROL_CONNECTION = 'properties';

module.exports = DacpClient;