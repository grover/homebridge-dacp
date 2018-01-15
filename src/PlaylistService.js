"use strict";

let Characteristic, Service;

class PlaylistService {

  constructor(homebridge, log, name, dacp, config) {
    Characteristic = homebridge.Characteristic;
    Service = homebridge.Service;

    this.log = log;
    this.name = name;
    this._dacp = dacp;
    this._config = config;

    this._service = this.createService();
  }

  getService() {
    return this._service;
  }

  createService() {
    const svc = new Service.PlaylistControlService('Playlist');

    this._config.playlists.forEach(playlist => {
      const c = new Characteristic.StartPlaylist(playlist);
      c.on('set', this._startPlaylist.bind(this, playlist, c))
        .updateValue(false);

      svc.addCharacteristic(c);
    });

    return svc;
  }

  async _startPlaylist(playlist, characteristic, value, callback) {

    if (value === false) {
      callback();
      return;
    }

    this.log(`Starting playlist ${playlist}`);

    try {
      await this._dacp.queue(playlist);
      await this._dacp.playQueue();

      this.log('Playlist started.');
      callback();

      setTimeout(() => {
        characteristic.updateValue(false);
      }, 500);
    }
    catch (error) {
      this.log('Failed to start playlist.');
      callback(error);
    }
  }
};

module.exports = PlaylistService;