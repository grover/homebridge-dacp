"use strict";

let Accessory, Characteristic, Service;

class PlayerControlsService {

  constructor(homebridge, log, name, dacp) {
    Accessory = homebridge.Accessory;
    Characteristic = homebridge.Characteristic;
    Service = homebridge.Service;

    this.log = log;
    this.name = name;
    this._dacp = dacp;

    this._service = this.createService();
  }

  getService() {
    return this._service;
  }

  createService() {
    const svc = new Service.PlayerControlsService(this.name);

    svc.getCharacteristic(Characteristic.PlayPause)
      .on('get', this._getPlayState.bind(this))
      .on('set', this._setPlayState.bind(this));

    return svc;
  }

  updatePlayerState(state) {

    this._isPlaying = state.playerState === 4;

    this._service.getCharacteristic(Characteristic.PlayPause)
      .updateValue(this._isPlaying);
  }

  _getPlayState(callback) {
    this.log(`Returning current playback state: ${this._isPlaying ? 'playing' : 'paused'}`);
    callback(undefined, this._isPlaying);
  }

  _setPlayState(isPlaying, callback) {
    this.log(`Setting current playback state: ${isPlaying ? 'playing' : 'paused'}`);

    this._isPlaying = isPlaying;
    this._dacp.sendRequest('ctrl-int/1/playpause')
      .then(response => {
        this.log('Playback status update done.');
        callback();
      })
      .catch(error => {
        this.log('Failed to send the playback request to the device.');
        callback();
      });
  }
};

module.exports = PlayerControlsService;