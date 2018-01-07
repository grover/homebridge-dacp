"use strict";

let Characteristic, Service;

class MediaSkippingService {

  constructor(homebridge, log, name, dacp) {
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
    const svc = new Service.MediaSkippingService(this.name);

    svc.getCharacteristic(Characteristic.SkipForward)
      .on('set', this._triggerSkipForward.bind(this));
    svc.getCharacteristic(Characteristic.SkipBackward)
      .on('set', this._triggerSkipBackward.bind(this));

    return svc;
  }

  _triggerSkipForward(skip, callback) {
    if (!skip) {
      callback();
      return;
    }

    this.log(`Skipping forward.`);

    try {
      this._dacp.nextTrack();
      this.log('Skipped to the next item.');
      callback();
    }
    catch (error) {
      this.log('Failed to send the playback request to the device.');
      // TODO: Pass error back to HomeKit
      callback();
    }

    this._resetCharacteristics();
  }

  async _triggerSkipBackward(skip, callback) {
    if (!skip) {
      callback();
      return;
    }

    this.log(`Skipping backward.`);

    try {
      await this._dacp.prevTrack();
      this.log('Skippped to the previous item.');
      callback();
    }
    catch (error) {
      this.log('Failed to send the playback request to the device.');
      // TODO: Pass error back to HomeKit
      callback();
    }

    this._resetCharacteristics();
  }

  _resetCharacteristics() {
    setTimeout(() => {
      this._service.getCharacteristic(Characteristic.SkipForward)
        .updateValue(false);
      this._service.getCharacteristic(Characteristic.SkipBackward)
        .updateValue(false);
    }, 100);
  }
};

module.exports = MediaSkippingService;