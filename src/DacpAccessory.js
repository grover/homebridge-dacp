"use strict";

const inherits = require('util').inherits;
const backoff = require('backoff');

const DacpClient = require('./dacp/DacpClient');

const MediaSkippingService = require('./MediaSkippingService');
const NowPlayingService = require('./NowPlayingService');
const PlayerControlsService = require('./PlayerControlsService');
const SpeakerService = require('./SpeakerService');

let Characteristic, Service, Homebridge;

class DacpAccessory {

  constructor(api, log, config, remote) {
    this.api = api;
    Characteristic = this.api.hap.Characteristic;
    Service = this.api.hap.Service;

    this.log = log;
    this.name = config.name;
    this.pairing = config.pairing;
    this.serviceName = config.serviceName;
    this.version = config.version;
    this.features = config.features || {};

    this._isAnnounced = false;
    this._isReachable = false;
    this._playStatusUpdateListeners = [];

    // Maximum backoff is 15mins when a device/program is visible
    this._backoff = backoff.exponential({
      initialDelay: 100,
      maxDelay: 900000
    }).on('backoff', (number, delay) => this._onBackoffStarted(delay))
      .on('ready', () => this._connectToDacpDevice());

    this._dacpClient = new DacpClient(log)
      .on('connected', sessionId => this._onDacpConnected(sessionId))
      .on('failed', e => this._onDacpFailure(e));

    this._services = this.createServices(this.api.hap);
  }

  getServices() {
    return this._services;
  }

  createServices(homebridge) {
    return [
      this.getAccessoryInformationService(),
      this.getBridgingStateService(),
      this.getSpeakerService(homebridge),
      this.getPlayerControlsService(homebridge),
      this.getNowPlayingService(homebridge),
      this.getMediaSkippingService(homebridge)
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

  getBridgingStateService() {
    this._bridgingService = new Service.BridgingState();

    this._bridgingService.getCharacteristic(Characteristic.Reachable)
      .on('get', this._getReachable.bind(this))
      .updateValue(this._isReachable);

    return this._bridgingService;
  }

  getSpeakerService(homebridge) {
    if (this.features && this.features['no-volume-controls'] === true) {
      return;
    }

    this._speakerService = new SpeakerService(homebridge, this.log, this.name, this._dacpClient);
    return this._speakerService.getService();
  }

  getPlayerControlsService(homebridge) {
    let service = Service.PlayerControlsService;
    let characteristic = Characteristic.PlayPause;

    if (this.features && this.features['alternate-playpause-switch'] === true) {
      service = Service.Switch;
      characteristic = Characteristic.On;
    }

    this._playerControlsService = new PlayerControlsService(homebridge, this.log, this.name, this._dacpClient, service, characteristic);
    this._playStatusUpdateListeners.push(this._playerControlsService);

    return this._playerControlsService.getService();
  }

  getNowPlayingService(homebridge) {
    this._nowPlayingService = new NowPlayingService(homebridge, this.log, this.name, this._dacpClient);
    this._playStatusUpdateListeners.push(this._nowPlayingService);

    return this._nowPlayingService.getService();
  }

  getMediaSkippingService(homebridge) {
    if (this.features && this.features['no-skip-controls'] === true) {
      return;
    }

    this._mediaSkippingService = new MediaSkippingService(homebridge, this.log, this.name, this._dacpClient);
    return this._mediaSkippingService.getService();
  }

  identify(callback) {
    this.log(`Identify requested on ${this.name}`);
    callback();
  }

  accessoryUp(service) {
    if (this._isAnnounced) {
      return;
    }

    this.log(`The accessory ${this.name} is announced.`);

    this._remoteHost = service.host;
    this._remotePort = service.port;
    this._isAnnounced = true;

    // Let backoff trigger the connection
    this._backoff.backoff();
  }

  accessoryDown() {
    this.log(`The accessory ${this.name} is down.`);

    this._isAnnounced = false;

    // Do not attempt to reconnect again
    this._backoff.reset();

    this._services.forEach(service => {
      if (service.accessoryDown) {
        service.accessoryDown();
      }
    });

    this._remoteHost = undefined;
    this._remotePort = undefined;
    this._setReachable(false);
  }

  _schedulePlayStatusUpdate() {
    this._dacpClient.requestPlayStatus()
      .then(response => {
        this._playStatusUpdateListeners.forEach(listener => {
          listener.update(response);
        });
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

  _connectToDacpDevice() {
    // Do not connect if a backoff interval expires and
    // the device has gone down in the mean time.
    if (!this._isAnnounced) {
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
        if (serverInfo.minm) {
          this.log(`Connected to ${serverInfo.minm} with session ID ${sessionId}`);
        }

        this._setReachable(true);
        this._schedulePlayStatusUpdate();
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
    if (this._isAnnounced) {
      this.log(`Attempting to reconnect to ${this.name} in ${delay / 1000} seconds.`);
    }
  }

  _getReachable(callback) {
    this.log(`Returning reachability state: ${this._isReachable}`);
    callback(undefined, this._isReachable);
  }

  _setReachable(state) {
    if (this._isReachable === state) {
      return;
    }

    this._isReachable = state;

    this._bridgingService.getCharacteristic(Characteristic.Reachable)
      .updateValue(this._isReachable);
  }
}

module.exports = DacpAccessory;
