"use strict";

let Accessory, Characteristic, Service;

class PlayerControlsService {

  constructor(homebridge, log, name, dacp, serviceCtor, characteristicCtor) {
    Accessory = homebridge.Accessory;
    Characteristic = homebridge.Characteristic;
    Service = homebridge.Service;

    this.log = log;
    this.name = name;
    this._dacp = dacp;
    this._serviceCtor = serviceCtor;
    this._characteristicCtor = characteristicCtor;

    this._service = this.createService();
  }

  getService() {
    return this._service;
  }

  createService() {
    const svc = new this._serviceCtor(this.name);

    svc.getCharacteristic(this._characteristicCtor)
      .on('get', this._getPlayState.bind(this))
      .on('set', this._setPlayState.bind(this));

    return svc;
  }

  update(response) {
    this._isPlaying = response.caps === 4;

    this._service.getCharacteristic(this._characteristicCtor)
      .updateValue(this._isPlaying);
  }

  _getPlayState(callback) {
    this.log(`Returning current playback state: ${this._isPlaying ? 'playing' : 'paused'}`);
    callback(undefined, this._isPlaying);
  }

  async _setPlayState(isPlaying, callback) {
    this.log(`Setting current playback state: ${isPlaying ? 'playing' : 'paused'}`);

    this._isPlaying = isPlaying;
    try {
      const response = await this._dacp.play();
      this.log('Playback status update done.');
      callback();
    }
    catch (error) {
      this.log('Failed to send the playback request to the device.');
      callback();
    }
  }
};

module.exports = PlayerControlsService;