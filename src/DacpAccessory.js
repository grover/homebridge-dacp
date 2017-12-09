"use strict";

const inherits = require('util').inherits;
const DacpClient = require('./dacp/DacpClient');

const NowPlayingService = require('./NowPlayingService');
const PlayerControlsService = require('./PlayerControlsService');
const SpeakerService = require('./SpeakerService');

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

    this._services = this.createServices(homebridge);
  }

  getServices() {
    return this._services;
  }

  createServices(homebridge) {
    return [
      this.getAccessoryInformationService(),
      this.getSpeakerService(homebridge),
      this.getPlayerControlsService(homebridge),
      this.getNowPlayingService(homebridge)
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

  getSpeakerService(homebridge) {
    if (this.features && this.features['volume-control'] === false) {
      return;
    }

    this._speakerService = new SpeakerService(homebridge, this.log, this.name, this._dacpClient);
    return this._speakerService.getService();
  }

  getPlayerControlsService(homebridge) {
    this._playerControlsService = new PlayerControlsService(homebridge, this.log, this.name, this._dacpClient);
    return this._playerControlsService.getService();
  }

  getNowPlayingService(homebridge) {
    this._nowPlayingService = new NowPlayingService(homebridge, this.log, this.name, this._dacpClient);
    return this._nowPlayingService.getService();
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
        if (response.cmst) {
          this._updateNowPlaying(response.cmst);
          this._updatePlayerControlService(response.cmst);
        }
      })
      .then(() => this._speakerService.update())
      .then(() => this._startRetrievingUpdates())
      .catch(() => {
        this.log(`[${this.name}] Retrieving updates from DACP server failed.`);
      });
  }

  _updateNowPlaying(response) {
    const state = {
      track: response.cann,
      album: response.canl,
      artist: response.cana,
      position: (response.cast - response.cant),
      duration: response.cast,
      playerState: response.caps
    };

    this._nowPlayingService.updateNowPlaying(state);
  }

  _updatePlayerControlService(response) {
    const state = {
      playerState: response.caps
    };

    this._playerControlsService.updatePlayerState(state);
  }
}

module.exports = DacpAccessory;
