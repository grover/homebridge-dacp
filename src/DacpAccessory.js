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
const DacpClient = require('./dacp/DacpClient');

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
    this.features = config.features || {};

    this._dacpClient = new DacpClient(log);
    this._dacpClient.on('readyStateChanged', () => this.log(this._dacpClient.readyState))

    this._services = this.createServices();
  }

  getServices() {
    return this._services;
  }

  createServices() {
    return [
      this.getAccessoryInformationService(),
      this.getSpeakerService(),
      this.getPlayerService()
    ].filter(m => m != null);
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

  getSpeakerService() {
    this._speakerService = new Service.Speaker(this.name);
    if (this.features && this.features['volume-control'] === false) {
      return;
    }

    this._speakerService.getCharacteristic(Characteristic.Volume)
      .on('get', this._getVolume.bind(this))
      .on('set', this._setVolume.bind(this));

    this._speakerService.getCharacteristic(Characteristic.Mute)
      .on('get', this._getMute.bind(this))
      .on('set', this._setMute.bind(this));

    return this._speakerService;
  }

  getPlayerService() {
    return null;
  }

  identify(callback) {
    this.log(`Identify requested on ${this.name}`);
    callback();
  }

  serviceUp(service) {
    this._dacpClient.login({ host: `${service.host}:${service.port}`, pairing: this.pairing })
      .then(() => this._dacpClient.getServerInfo())
      .then(serverInfo => this.log(`Connected to ${serverInfo.msrv.minm}`))
      .then(() => this._startRetrievingUpdates())
      .catch(error => this.log(`[${this.name}] Connection to DACP server failed.`));
  }

  serviceDown() {
    this._dacpClient.logout();
  }

  _startRetrievingUpdates() {
    this._dacpClient.getUpdate()
      .then(response => {
        // TODO: Update Now playing service
        // TODO: Update player service
        //this.log(response);
      })
      .then(() => this._refreshSpeakerCharacteristics())
      .then(() => this._startRetrievingUpdates())
      .catch(() => {
        this.log(`[${this.name}] Retrieving updates from DACP server failed.`);
      });
  }

  _refreshSpeakerCharacteristics() {
    this._dacpClient.getProperty('dmcp.volume')
      .then(response => {
        if (response.cmgt && response.cmgt.cmvo !== undefined) {
          this._updateSpeakerCharacteristics(response.cmgt.cmvo);
        }
      })
      .catch(error => {
        this.log('Failed to retrieve speaker volume ' + error);
      });
  }

  _updateSpeakerCharacteristics(volume) {
    this.log("Updating characteristics with current volume: v=" + volume);

    this._speakerService.getCharacteristic(Characteristic.Volume)
      .updateValue(volume, undefined, undefined);
    this._speakerService.getCharacteristic(Characteristic.Mute)
      .updateValue(volume === 0, undefined, undefined);

    this._volume = volume;
    if (volume != 0 && this._hasMuted) {
      this._unmutedViaDevice();
    }
  }

  _getVolume(callback) {
    this._dacpClient.getProperty('dmcp.volume')
      .then(response => {
        this.log("Returning current volume: v=" + response.cmgt.cmvo);
        callback(undefined, response.cmgt.cmvo);
        this._volume = response.cmgt.cmvo;
      })
      .catch(error => {
        callback(error, undefined);
      });
  }

  _setVolume(volume, callback) {
    this.log("Setting current volume to v=" + volume);

    this._dacpClient.setProperty('dmcp.volume', volume)
      .then(() => {
        callback();
        this._updateSpeakerCharacteristics(volume);
      })
      .catch(error => {
        callback(error);
      });
  }

  _getMute(callback) {
    this._dacpClient.getProperty('dmcp.volume')
      .then(response => {
        this.log("Returning current mute state: v=" + response.cmgt.cmvo === 0);
        callback(undefined, response.cmgt.cmvo === 0);
      })
      .catch(error => {
        callback(error, undefined);
      });
  }

  _setMute(muted, callback) {
    this.log(`Setting current mute state to ${muted ? "muted" : "unmuted"}`);

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

module.exports = DacpAccessory;
