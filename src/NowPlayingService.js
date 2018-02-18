'use strict';

let Characteristic, Service;

const moment = require('moment');
const util = require('util');

class NowPlayingService {

  constructor(homebridge, log, name, dacp) {
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
    this._state = {
      track: '',
      album: '',
      artist: '',
      genre: '',
      type: -1,
      position: Number.NaN,
      duration: Number.NaN,
      playerState: 0
    };

    this._updateCharacteristics();
  }

  update(response) {
    this._state = {
      track: this._getProperty(response, 'cann', ''),
      album: this._getProperty(response, 'canl', ''),
      artist: this._getProperty(response, 'cana', ''),
      genre: this._getProperty(response, 'cang', ''),
      mediaType: this._getProperty(response, 'cmmk', 0),
      remaining: this._getProperty(response, 'cant', Number.NaN),
      duration: this._getProperty(response, 'cast', Number.NaN),
      playerState: this._getProperty(response, 'caps', 0)
    };

    this._updateCharacteristics();
  }

  _getProperty(response, prop, defaultValue) {
    if (response.hasOwnProperty(prop)) {
      return response[prop];
    }

    return defaultValue;
  }

  _updateCharacteristics() {

    this._service.getCharacteristic(Characteristic.Title)
      .updateValue(this._state.track);

    this._service.getCharacteristic(Characteristic.Album)
      .updateValue(this._state.album);

    this._service.getCharacteristic(Characteristic.Artist)
      .updateValue(this._state.artist);

    this._service.getCharacteristic(Characteristic.Genre)
      .updateValue(this._state.genre);

    this._service.getCharacteristic(Characteristic.MediaType)
      .updateValue(this._state.mediaType);

    this._updatePosition();
    this._respectPlayerState();
  }

  _updatePosition() {
    this._setTime(Characteristic.MediaCurrentPosition, (this._state.duration - this._state.remaining) / 1000);
    this._setTime(Characteristic.MediaItemDuration, this._state.duration / 1000);
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

  _respectPlayerState() {
    if (this._state.playerState === 4) {
      if (!this._timeout) {
        this._timeout = setTimeout(this._requestPlaybackPosition.bind(this), 1000);
      }
    }
    else if (this._timeout) {
      clearTimeout(this._timeout);
      this._timeout = undefined;
    }
  }

  async _requestPlaybackPosition() {
    try {
      const response = await this._dacp.getProperty('dacp.playingtime');
      this._timeout = undefined;

      this._state.remaining = this._getProperty(response, 'cant', Number.NaN);
      this._state.duration = this._getProperty(response, 'cast', Number.NaN);

      this._updateCharacteristics();
      this._respectPlayerState();
    }
    catch (e) {
      this.log(`Failed to retrieve the current playback position. Stopping continuous updates. Error: ${util.inspect(e)}`);
      this._resetCharacteristicsToDefaults();
    }
  }
}

module.exports = NowPlayingService;
