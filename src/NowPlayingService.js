"use strict";

let Accessory, Characteristic, Service;

const moment = require('moment');

class NowPlayingService {

  constructor(homebridge, log, name, dacp) {
    Accessory = homebridge.Accessory;
    Characteristic = homebridge.Characteristic;
    Service = homebridge.Service;

    this.log = log;
    this.name = name;
    this._dacp = dacp;
    this._interval = undefined;
    this._trackPosition = 0;

    this.createService();
  }

  getService() {
    return this._service;
  }

  createService() {
    this._service = new Service.NowPlayingService(this.name);
    this._resetCharacteristicsToDefaults();
  }

  accessoryDown() {
    this._resetCharacteristicsToDefaults();
  }

  _resetCharacteristicsToDefaults() {
    const emptyState = {
      track: '',
      album: '',
      artist: '',
      genre: '',
      type: -1,
      position: Number.NaN,
      duration: Number.NaN,
      playerState: 0
    };

    this.updateNowPlaying(emptyState);
  }

  updateNowPlaying(state) {
    this._service.getCharacteristic(Characteristic.Title)
      .updateValue(state.track);

    this._service.getCharacteristic(Characteristic.Album)
      .updateValue(state.album);

    this._service.getCharacteristic(Characteristic.Artist)
      .updateValue(state.artist);

    this._service.getCharacteristic(Characteristic.Genre)
      .updateValue(state.genre);

    this._service.getCharacteristic(Characteristic.MediaType)
      .updateValue(state.mediaType);

    this._setTime(Characteristic.MediaCurrentPosition, state.position / 1000);
    this._setTime(Characteristic.MediaItemDuration, state.duration / 1000);
    this._trackPosition = state.position / 1000;

    if (state.playerState === 4) {
      if (!this._interval) {
        this._interval = setInterval(this._updatePosition.bind(this), 1000);
      }
    }
    else if (this._interval) {
      clearInterval(this._interval);
      this._interval = undefined;
    }
  }

  _updatePosition() {
    this._trackPosition += 1;
    this._setTime(Characteristic.MediaCurrentPosition, this._trackPosition);
  }

  _setTime(characteristic, totalSeconds) {
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = Math.round(totalSeconds - (minutes * 60));

    let value = '';
    if (!Number.isNaN(seconds)) {
      value = moment({ minutes: minutes, seconds: seconds }).format('mm:ss');
    }

    this._service.getCharacteristic(characteristic)
      .updateValue(value);
  }
};

module.exports = NowPlayingService;