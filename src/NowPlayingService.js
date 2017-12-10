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
    this._timeout = undefined;

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
    this._mediaDuration = this.duration;
    this._mediaRemaining = this.remaining;

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

    this._updatePosition();
    this._respectPlayerState(state);
  }

  _updatePosition() {
    this._setTime(Characteristic.MediaCurrentPosition, (this._mediaDuration - this._mediaRemaining) / 1000);
    this._setTime(Characteristic.MediaItemDuration, this._mediaDuration / 1000);
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

  _respectPlayerState(state) {
    if (state.playerState === 4) {
      if (!this._timeout) {
        this._timeout = setTimeout(this._requestPlaybackPosition.bind(this), 1000);
      }
    }
    else if (this._timeout) {
      clearTimeout(this._timeout);
      this._timeout = undefined;
    }
  }

  _requestPlaybackPosition() {
    this._dacp.getProperty('dacp.remainingtime')
      .then(response => {
        this.log(JSON.stringify(response));

        this._timeout = setTimeout(this._requestPlaybackPosition.bind(this), 1000);
      })
      .catch(e => {
        this.log('Failed to retrieve the current playback position. Stopping continuous updates.');

        this._mediaDuration = Number.NaN;
        this._mediaRemaining = Number.NaN;

        this._updatePosition();
      });
  }
};

module.exports = NowPlayingService;
