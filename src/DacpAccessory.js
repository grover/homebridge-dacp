'use strict';

const util = require('util');
const backoff = require('backoff');

const DacpClient = require('./dacp/DacpClient');

const MediaSkippingService = require('./MediaSkippingService');
const NowPlayingService = require('./NowPlayingService');
const PlayerControlsService = require('./PlayerControlsService');
const SpeakerService = require('./SpeakerService');
const PlaylistService = require('./PlaylistService');
const InputControlService = require('./InputControlService');
const MacrosService = require('./MacrosService');

let Characteristic, Service;

class DacpAccessory {

  constructor(api, log, config) {
    this.api = api;
    Characteristic = this.api.hap.Characteristic;
    Service = this.api.hap.Service;

    this.log = log;
    this.name = config.name;
    this.serviceName = config.serviceName;

    this.config = config;
    if (this.config.features === undefined) {
      this.config.features = {};
    }

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
      this.getPlayerControlsService(homebridge),
      this.getSpeakerService(homebridge),
      this.getNowPlayingService(homebridge),
      this.getMediaSkippingService(homebridge),
      this.getPlaylistService(homebridge),
      ...this.getInputControlService(homebridge),
      ...this.getMacrosService(homebridge)
    ].filter(m => m != null);
  }

  getAccessoryInformationService() {
    return new Service.AccessoryInformation()
      .setCharacteristic(Characteristic.Name, this.name)
      .setCharacteristic(Characteristic.Manufacturer, 'Michael Froehlich')
      .setCharacteristic(Characteristic.Model, 'DACP Accessory')
      .setCharacteristic(Characteristic.SerialNumber, '42')
      .setCharacteristic(Characteristic.FirmwareRevision, this.config.version)
      .setCharacteristic(Characteristic.HardwareRevision, this.config.version);
  }

  getBridgingStateService() {
    this._bridgingService = new Service.BridgingState();

    this._bridgingService.getCharacteristic(Characteristic.Reachable)
      .on('get', this._getReachable.bind(this))
      .updateValue(this._isReachable);

    return this._bridgingService;
  }

  getSpeakerService(homebridge) {
    if (this.config.features['no-volume-controls'] === true) {
      return;
    }

    this._speakerService = new SpeakerService(homebridge, this.log, this.name, this._dacpClient);
    return this._speakerService.getService();
  }

  getPlayerControlsService(homebridge) {
    let service = Service.PlayerControlsService;
    let characteristic = Characteristic.PlayPause;

    if (this.config.features['alternate-playpause-switch'] === true) {
      service = Service.Switch;
      characteristic = Characteristic.On;
    }

    this._playerControlsService = new PlayerControlsService(homebridge, this.log, this.name, this._dacpClient, service, characteristic);
    this._playStatusUpdateListeners.push(this._playerControlsService);

    return this._playerControlsService.getService();
  }

  getNowPlayingService(homebridge) {
    const artworkFile = this.config.features['album-artwork'];

    this._nowPlayingService = new NowPlayingService(homebridge, this.log, this.name, this._dacpClient, artworkFile);
    this._playStatusUpdateListeners.push(this._nowPlayingService);

    return this._nowPlayingService.getService();
  }

  getMediaSkippingService(homebridge) {
    if (this.config.features['no-skip-controls'] === true) {
      return undefined;
    }

    this._mediaSkippingService = new MediaSkippingService(homebridge, this.log, this.name, this._dacpClient);
    return this._mediaSkippingService.getService();
  }

  getPlaylistService(homebridge) {
    if (!this.config.playlists) {
      return undefined;
    }

    this._playlistService = new PlaylistService(homebridge, this.log, this.name, this._dacpClient, this.config);
    return this._playlistService.getService();
  }

  getInputControlService(homebridge) {
    if (this.config.features === undefined
      || this.config.features.hasOwnProperty('input-controls') === false
      || this.config.features.hasOwnProperty('alternate-input-controls') === false) {
      return [];
    }

    this._inputControlService = new InputControlService(homebridge, this.log, this.name, this._dacpClient, this.config.features);
    return this._inputControlService.getService();
  }

  getMacrosService(homebridge) {
    if (this.config.macros === undefined) {
      return [];
    }

    this._macroService = new MacrosService(homebridge, this.log, this.name, this._dacpClient, this.config.macros);
    return this._macroService.getService();
  }

  identify(callback) {
    this.log(`Identify requested on ${this.name}`);
    callback();
  }

  accessoryUp(service) {
    if (this._isAnnounced) {
      return;
    }

    this.log(`The accessory ${this.name} is announced as ${service.host}:${service.port}.`);
    this.log(`It's an ${service.txtRecord.DvTy} named ${service.txtRecord.CtlN}`);

    this._service = service;
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

    this._dacpClient.disconnect();
    this._service = undefined;
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
        this.log(`[${this.name}] Retrieving updates from DACP server failed with error ${util.inspect(e)}`);
      });
  }

  _connectToDacpDevice() {
    // Do not connect if a backoff interval expires and
    // the device has gone down in the mean time.
    if (!this._isAnnounced) {
      return;
    }

    const settings = {
      host: `${this._service.host}:${this._service.port}`,
      pairing: this.config.pairing
    };

    this.log(`Connecting to ${this.name} (${this._service.host}:${this._service.port})`);
    this._dacpClient.connect(settings)
      .then(serverInfo => {
        if (serverInfo.minm) {
          this.log(`Connected to ${serverInfo.minm}`);
        }
        this._backoff.reset();

        this._setReachable(true);
        this._schedulePlayStatusUpdate();
      })
      .catch(error => {
        this.log(`[${this.name}] Connection to DACP server failed: ${util.inspect(error)}`);

        this._backoff.backoff();
      });
  }

  _onDacpFailure(e) {
    this.log(`Fatal error while talking to ${this.name}:`);
    this.log('');
    this.log(`  Error: ${util.inspect(e)}`);
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
