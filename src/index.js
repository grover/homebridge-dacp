'use strict';

const version = require('../package.json').version;

const isPi = require('detect-rpi');

const DacpAccessory = require('./DacpAccessory');
const DacpBrowser = require('./dacp/DacpBrowser');
const DacpRemote = require('./dacp/DacpRemote');

const MediaSkippingTypes = require('./hap/MediaSkippingTypes');
const NowPlayingTypes = require('./hap/NowPlayingTypes');
const PlayerControlTypes = require('./hap/PlayerControlsTypes');
const PlaylistTypes = require('./hap/PlaylistTypes');
const InputControlTypes = require('./hap/InputControlTypes');

const ArtworkCamera = require('./artwork/ArtworkCamera');

const HOMEBRIDGE = {
  hap: null,
  Accessory: null,
  Service: null,
  Characteristic: null,
  UUIDGen: null
};

const platformName = 'homebridge-dacp';
const platformPrettyName = 'DACP';

module.exports = (homebridge) => {
  HOMEBRIDGE.hap = homebridge.hap;
  HOMEBRIDGE.Accessory = homebridge.platformAccessory;
  HOMEBRIDGE.Service = homebridge.hap.Service;
  HOMEBRIDGE.Characteristic = homebridge.hap.Characteristic;
  HOMEBRIDGE.UUIDGen = homebridge.hap.uuid;
  HOMEBRIDGE.homebridge = homebridge;

  homebridge.registerPlatform(platformName, platformPrettyName, DacpPlatform, false);
};

const DacpPlatform = class {
  constructor(log, config, api) {
    this.log = log;
    this.log(`DACP Platform Plugin Loaded - Version ${version}`);
    this.config = config;
    this.api = api;

    this._dacpBrowser = new DacpBrowser(this.log);
    this._dacpBrowser.on('serviceUp', this._onServiceUp.bind(this));
    this._dacpBrowser.on('serviceDown', this._onServiceDown.bind(this));
    this._dacpBrowser.on('error', this._onDacpBrowserError.bind(this));

    this._dacpErrors = 0;

    this._accessories = [];
    this._remotes = [];

    this.api.on('didFinishLaunching', this._didFinishLaunching.bind(this));

    MediaSkippingTypes.registerWith(api.hap);
    NowPlayingTypes.registerWith(api.hap);
    PlayerControlTypes.registerWith(api.hap);
    PlaylistTypes.registerWith(api.hap);
    InputControlTypes.registerWith(api.hap);
  }

  _didFinishLaunching() {
    // Start looking for the controllable accessories
    this._dacpBrowser.start();

    // Enable all artwork cameras (if any)
    this._enableArtworkCameras();
  }

  _enableArtworkCameras() {
    const configuredAccessories = [];

    this.config.devices.forEach(device => {
      const artwork = device.features['album-artwork'];
      if (typeof artwork === 'string') {
        const cameraName = `${device.name} Artwork`;
        const videoConfig = {
          "binary": "ffmpeg",
          "vcodec": "libx264",
          "artworkImageSource": artwork,
          "maxStreams": 2,
          "maxWidth": 600,
          "maxHeight": 600,
          "maxFPS": 2
        };

        if (isPi()) {
          videoConfig.vcodec = 'h264_omx';
        }

        const uuid = HOMEBRIDGE.UUIDGen.generate(cameraName);
        const artworkCameraAccessory = new HOMEBRIDGE.Accessory(cameraName, uuid, HOMEBRIDGE.hap.Accessory.Categories.CAMERA);
        const artworkCamera = new ArtworkCamera(this.log, HOMEBRIDGE.hap, videoConfig);

        artworkCameraAccessory.configureCameraSource(artworkCamera);
        configuredAccessories.push(artworkCameraAccessory);
      }
    });

    if (configuredAccessories.length > 0) {
      this.api.publishCameraAccessories(platformPrettyName, configuredAccessories);
    }
  }

  _onServiceUp(service) {
    // If the browser was down this is also an indication that it's up again.
    this._dacpErrors = 0;

    // Update accessory and tell it that it's device is available.
    this._accessories.forEach(accessory => {
      if (accessory.serviceName && service.name === accessory.serviceName) {
        accessory.accessoryUp(service);
      }
    });
  }

  _onServiceDown(service) {
    // Update accessory and tell it that it's device is unavailable.
    this._accessories.forEach(accessory => {
      if (accessory.serviceName && service.name === accessory.serviceName) {
        accessory.accessoryDown(service);
      }
    });
  }

  _onDacpBrowserError(error) {


    // How often has this occurred? If less than 5 times within last 10mins,
    // keep retrying. We might have a sporadic network disconnect or other reason
    // that this has been failing. We want to deal with this gracefully, so we 
    // need a restart strategy for the DACP browser and the accessories.

    this.log('Fatal error browsing for DACP services:');
    this.log('');
    this.log(`  Error: ${JSON.stringify(error)}`);
    this.log('');

    this._dacpErrors++;
    this._dacpBrowser.stop();

    if (this._dacpErrors < 5) {
      const timeout = 120000;
      this.log(`Restarting MDNS browser for DACP in ${timeout / 1000} seconds.`);
      setTimeout(() => this._dacpBrowser.start(), timeout);
    }
    else {
      this.log('There were 5 failures in the past 600s. Giving up.');
      this.log('');
      this.log('Restarting homebridge might fix the problem. If not, file an issue at https://github.com/grover/homebridge-dacp.');
    }

    this.log('');

    // Mark all accessories as unavailable
    this._accessories.forEach(accessory => {
      accessory.accessoryDown();
    });
  }

  accessories(callback) {
    const { devices } = this.config;

    this._accessories = devices.map(device => {

      this.log(`Found accessory in config: "${device.name}"`);

      if (!device.pairing || !device.serviceName) {
        const passcode = this._randomBaseString(4, 10);

        this.log('');
        this.log(`Skipping creation of the accessory "${device.name}" because it doesn't have a pairing code or`);
        this.log('service name yet. You need to pair the device/iTunes, reconfigure and restart homebridge.');
        this.log('');
        this.log(`Beginning remote control announcements for the accessory "${device.name}".`);
        this.log('');
        this.log(`\tUse passcode ${passcode} to pair with this remote control.`);
        this.log('');

        this._createRemote(device, passcode);
        return;
      }

      device.uuid = HOMEBRIDGE.UUIDGen.generate(platformPrettyName + ':' + device.name);
      device.version = version;

      return new DacpAccessory(this.api, this.log, device);
    }).filter(a => a !== undefined);

    callback(this._accessories);
  }

  _createRemote(remote, passcode) {

    const remoteConfig = {
      pair: this._randomBaseString(16, 16).toUpperCase(),
      pairPasscode: passcode,
      deviceName: remote.name,
      deviceType: 'iPad'
    };
    const dacpRemote = new DacpRemote(remoteConfig, this.log);

    dacpRemote.on('paired', data => {
      this.log(`Completed pairing for "${remote.name}":`);
      this.log('');
      this.log('{');
      this.log(`  "name": "${remote.name}",`);
      this.log(`  "pairing": "${remoteConfig.pair}",`);
      this.log(`  "serviceName": "${data.serviceName}"`);
      this.log('}');
      this.log('');
      this.log('Please add the above block to the accessory in your homebridge config.json');
      this.log('');
      this.log('YOU MUST RESTART HOMEBRIDGE AFTER YOU ADDED THE ABOVE LINES OR THE ACCESSORY');
      this.log('WILL NOT WORK.');
      this.log('');
    });

    this._remotes.push(dacpRemote);
  }

  _randomBaseString(length, base) {
    var generated = '';
    for (var ctr = 0; ctr < length; ctr++)
      generated += Math.floor(Math.random() * base).toString(base);
    return generated;
  }
};
