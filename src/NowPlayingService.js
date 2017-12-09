"use strict";

let Accessory, Characteristic, Service;

class NowPlayingService {

  constructor(homebridge, log, name) {
    Accessory = homebridge.Accessory;
    Characteristic = homebridge.Characteristic;
    Service = homebridge.Service;

    this.log = log;
    this.name = name;

    this._service = this.createService();
  }

  getService() {
    return this._service;
  }

  createService() {
    const svc = new Service.NowPlayingService(this.name);
    return svc;
  }

  updateNowPlaying(state) {
    this.log('Updating now playing.');

    this._service.getCharacteristic(Characteristic.Title)
      .updateValue(state.track);

    this._service.getCharacteristic(Characteristic.Album)
      .updateValue(state.album);

    this._service.getCharacteristic(Characteristic.Artist)
      .updateValue(state.artist);

    this._service.getCharacteristic(Characteristic.MediaCurrentPosition)
      .updateValue(state.position);

    this._service.getCharacteristic(Characteristic.MediaItemDuration)
      .updateValue(state.duration);
  }
};

module.exports = NowPlayingService;