'use strict';

const util = require('util');

let Characteristic, Service;

class SpeakerService {

  constructor(homebridge, log, name, dacp) {
    Characteristic = homebridge.Characteristic;
    Service = homebridge.Service;

    this.log = log;
    this.name = name;
    this._dacp = dacp;

    this._hasMuted = false;
    this._volume = 0;
    this._restoreVolume = undefined;

    this._service = this.createService();
  }

  getService() {
    return this._service;
  }

  createService() {
    const speakerService = new Service.Speaker(this.name);

    speakerService.getCharacteristic(Characteristic.Volume)
      .on('get', this._getVolume.bind(this))
      .on('set', this._setVolume.bind(this))
      .updateValue(this._volume, undefined, undefined);

    speakerService.getCharacteristic(Characteristic.Mute)
      .on('get', this._getMute.bind(this))
      .on('set', this._setMute.bind(this))
      .updateValue(this._volume === 0, undefined, undefined);

    speakerService.getCharacteristic(Characteristic.On)
      .updateValue(true);

    return speakerService;
  }

  async update() {
    try {
      const response = await this._dacp.getProperty('dmcp.volume');
      if (response && response.cmvo !== undefined) {
        this._updateSpeakerCharacteristics(response.cmvo);
      }
    }
    catch (error) {
      this.log(`Failed to retrieve speaker volume ${util.inspect(error)}`);
    }
  }

  _updateSpeakerCharacteristics(volume) {
    this.log(`Updating characteristics with current volume: v=${volume}`);

    this._service.getCharacteristic(Characteristic.Volume)
      .updateValue(volume, undefined, undefined);
    this._service.getCharacteristic(Characteristic.Mute)
      .updateValue(volume === 0, undefined, undefined);

    this._volume = volume;
    if (volume != 0 && this._hasMuted) {
      this._unmutedViaDevice();
    }
  }

  async _getVolume(callback) {
    try {
      const response = await this._dacp.getProperty('dmcp.volume');
      response.cmvo = response.cmvo || 0;
      this.log(`Returning current volume: v=${response.cmvo}`);
      callback(undefined, response.cmvo);
      this._volume = response.cmvo;
    }
    catch (error) {
      callback(error, undefined);
    }
  }

  async _setVolume(volume, callback) {
    this.log(`Setting current volume to v=${volume}`);

    try {
      await this._dacp.setProperty({
        'dmcp.volume': volume
      });

      callback();
      this._updateSpeakerCharacteristics(volume);
    }
    catch (error) {
      callback(error);
    }
  }

  async _getMute(callback) {
    try {
      const response = await this._dacp.getProperty('dmcp.volume');
      response.cmvo = response.cmvo || 0;
      this.log(`Returning current mute state: v=${response.cmvo === 0}`);
      callback(undefined, response.cmvo === 0);
    }
    catch (error) {
      callback(error, undefined);
    }
  }

  _setMute(muted, callback) {
    this.log(`Setting current mute state to ${muted ? 'muted' : 'unmuted'}`);

    if (muted) {
      this._mute(callback);
    }
    else {
      this._unmuteViaHomeKit(callback);
    }
  }

  _mute(callback) {
    this._hasMuted = true;
    this._restoreVolume = this._volume;

    this._setVolume(0, callback);
  }

  _unmuteViaHomeKit(callback) {
    // Unmuted via HomeKit, muted via HomeKit
    const volume = this._restoreVolume || 25;
    this._setVolume(volume, callback);
    this._hasMuted = false;
    this._restoreVolume = undefined;
  }

  _unmutedViaDevice() {
    // Unmuted via device, muted via HomeKit
    this._hasMuted = false;
    this._restoreVolume = undefined;
  }
}

module.exports = SpeakerService;
