//
// Accessory, which provides a bunch of services for each of the discovered/configured
// DACP devices.
//
// Services:
// - Accessory Information Service
//
// - Speaker service (unless device is Apple TV, currently only iTunes)
// -- Volume
// -- Mute state
//
// - Playback Status Service
// -- Play/Pause toggle switch (?)
// -- IsPlaying information (?)
// -- Seeking?
//

"use strict";

const inherits = require('util').inherits;

let Accessory, Characteristic, Service;

class DacpAccessory {

  constructor(homebridge, log, config, remote) {
    Accessory = homebridge.Accessory;
    Characteristic = homebridge.Characteristic;
    Service = homebridge.Service;

    this.log = log;
    this.name = config.name;
    this.pairing = config.pairing;
    this.serviceName = config.serviceName;
    this.version = config.version;

    this._services = this.createServices();
  }

  getServices() {
    return this._services;
  }

  createServices() {
    return [
      this.getAccessoryInformationService(),
    ];
  }

  getAccessoryInformationService() {
    return new Service.AccessoryInformation()
      .setCharacteristic(Characteristic.Name, this.name)
      .setCharacteristic(Characteristic.Manufacturer, 'Michael Froehlich')
      .setCharacteristic(Characteristic.Model, 'DACP Accessory')
      .setCharacteristic(Characteristic.SerialNumber, '42')
      .setCharacteristic(Characteristic.FirmwareRevision, this.version)
      .setCharacteristic(Characteristic.HardwareRevision, this.version);
  }

  identify(callback) {
    this.log(`Identify requested on ${this.name}`);
    callback();
  }
}

module.exports = DacpAccessory;
