"use strict";

const inherits = require('util').inherits;
const backoff = require('backoff');

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

    this._isReachable = false;

    // Maximum backoff is 15mins when a device/program is visible
    this._backoff = backoff.exponential({
      initialDelay: 100,
      maxDelay: 900000
    }).on('backoff', (number, delay) => this._onBackoffStarted(delay))
      .on('ready', () => this._connectToDacpDevice());

    this._dacpClient = new DacpClient(log)
      .on('connected', sessionId => this._onDacpConnected(sessionId))
      .on('failed', e => this._onDacpFailure(e));

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

  accessoryUp(service) {
    if (this._isReachable) {
      return;
    }

    this.log(`The accessory ${this.name} is announced.`);

    this._isReachable = true;
    this._remoteHost = service.host;
    this._remotePort = service.port;

    // Let backoff trigger the connection
    this._backoff.backoff();
  }

  accessoryDown() {
    this.log(`The accessory ${this.name} is down.`);

    // Do not attempt to reconnect again
    this._backoff.reset();

    this._services.forEach(service => {
      if (service.accessoryDown) {
        service.accessoryDown();
      }
    });

    this._remoteHost = undefined;
    this._remotePort = undefined;
    this._isReachable = false;

    // this.updateReachability(false);
  }

  _schedulePlayStatusUpdate() {
    this._dacpClient.requestPlayStatus()
      .then(response => {
        if (response.cmst) {
          this._updateNowPlaying(response.cmst);
          this._updatePlayerControlService(response.cmst);
        }
      })
      .then(() => {
        if (this._speakerService) {
          return this._speakerService.update();
        }

        return Promise.resolve();
      })
      .then(() => {
        this._schedulePlayStatusUpdate();
      })
      .catch(e => {
        this.log(`[${this.name}] Retrieving updates from DACP server failed with error ${e}`);
      });
  }

  _updateNowPlaying(response) {
    const state = {
      track: response.cann || '',
      album: response.canl || '',
      artist: response.cana || '',
      genre: response.cang || '',
      mediaType: response.cmmk || -1,
      position: (response.cast - response.cant),
      duration: response.cast || Number.NaN,
      playerState: response.caps || 0
    };

    this._nowPlayingService.updateNowPlaying(state);
  }

  _updatePlayerControlService(response) {
    const state = {
      playerState: response.caps
    };

    this._playerControlsService.updatePlayerState(state);
  }

  _connectToDacpDevice() {
    // Do not connect if a backoff interval expires and
    // the device has gone down in the mean time.
    if (!this._isReachable) {
      return;
    }

    this.log(`Connecting to ${this._remoteHost}:${this._remotePort} for ${this.name}`);
    this._dacpClient.login({ host: `${this._remoteHost}:${this._remotePort}`, pairing: this.pairing })
      .catch(error => {
        this.log(`[${this.name}] Connection to DACP server failed: ${error}`);

        this._backoff.backoff();
      });
  }

  _onDacpConnected(sessionId) {
    this._backoff.reset();

    this._dacpClient.getServerInfo()
      .then(serverInfo => {
        if (serverInfo.msrv && serverInfo.msrv.minm) {
          this.log(`Connected to ${serverInfo.msrv.minm} with session ID ${sessionId}`);
        }

        this._schedulePlayStatusUpdate();

        // this.updateReachability(true);
      })
      .catch(e => {
        this.log(`[${this.name}] Retrieving server info from DACP server failed with error ${e}`);
      });
  }

  _onDacpFailure(e) {
    this.log(`Fatal error while talking to ${this.name}:`);
    this.log('');
    this.log(`  Error: ${JSON.stringify(e)}`);
    this.log('');

    this._backoff.backoff();
  }

  _onBackoffStarted(delay) {
    if (this._isReachable) {
      this.log(`Attempting to reconnect to ${this.name} in ${delay / 1000} seconds.`);
    }
  }
}

module.exports = DacpAccessory;
