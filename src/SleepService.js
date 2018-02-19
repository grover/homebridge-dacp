"use strict";

let Accessory, Characteristic, Service;

class SleepService {

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
      //.on('get', this._getSleep.bind(this))
      .on('set', this._setSleep.bind(this));

    return svc;
  }

  update(response) {
    this._isPlaying = response.caps === 4;

    this._service.getCharacteristic(this._characteristicCtor)
      .updateValue(this._isPlaying);
  }

  _setSleep(isPlaying, callback) {

    this._isPlaying = isPlaying;
    this.log('Trying to put Apple TV to sleep :)');
    const { exec } = require('child_process');
    //Adjust the commands below according to where your "General" app is on your springboard
    //These commands in this exemple work if the "General" app is at the bottom left corner
    exec(`
      atvremote -a top_menu &&
      atvremote -a left left left left left down down down down &&
      atvremote -a select &&
      atvremote -a down down down down down down down down &&
      atvremote -a select`, (err, stdout, stderr) => {
      if (err) {
        return;
      }
    });
    callback();
  }
};

module.exports = SleepService;
