'use strict';

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
      this.done(callback, characteristic);
      return;
    }

    if (this._dacp.isAppleTV()) {
      this.log('Playlists not supported on AppleTV.');
      this.done(callback, characteristic);
      return;
    }

    this.log(`Starting playlist ${playlist}`);

    try {
      await this._dacp.queue(playlist);
      await this._dacp.playQueue();

      this.log('Playlist started.');
      this.done(callback, characteristic);
    }
    catch (error) {
      this.log('Failed to start playlist.');
      callback(error);
    }
  }

  done(callback, characteristic) {
    callback();

    setTimeout(() => {
      characteristic.updateValue(false);
    }, 500);
  }
}

module.exports = PlaylistService;