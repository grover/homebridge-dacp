const version = require('../package.json').version;
const DacpAccessory = require('./DacpAccessory');
const DacpBrowser = require('./dacp/DacpBrowser');
const DacpRemote = require('./dacp/DacpRemote');

const HOMEBRIDGE = {
  Accessory: null,
  Service: null,
  Characteristic: null,
  UUIDGen: null
};

const platformName = 'homebridge-dacp';
const platformPrettyName = 'DACP';

module.exports = (homebridge) => {
  HOMEBRIDGE.Accessory = homebridge.platformAccessory;
  HOMEBRIDGE.Service = homebridge.hap.Service;
  HOMEBRIDGE.Characteristic = homebridge.hap.Characteristic;
  HOMEBRIDGE.UUIDGen = homebridge.hap.uuid;

  homebridge.registerPlatform(platformName, platformPrettyName, DacpPlatform, true);
}

const DacpPlatform = class {
  constructor(log, config, api) {
    this.log = log;
    this.log('DACP Platform Plugin Loaded');
    this.config = config;
    this.api = api;
    this._remotes = [];

    this.api.on('didFinishLaunching', this._didFinishLaunching.bind(this));
  }

  _didFinishLaunching() {
    this._dacpBrowser = new DacpBrowser(this.log);
    this._dacpBrowser.start();

    this._remotes.forEach(remote => remote.start());
  }

  _randomBaseString(length, base) {
    var generated = "";
    for (var ctr = 0; ctr < length; ctr++)
      generated += Math.floor(Math.random() * base).toString(base);
    return generated;
  };

  accessories(callback) {
    let _accessories = [];

    const { remotes } = this.config;

    remotes.forEach(remote => {

      this._createRemote(remote);

      remote.devices.forEach(device => {
        this.log(`Found device in config: "${device.name}"`);

        if (!device.pairing || !device.serviceName) {
          this.log('Skipping device because it doesn\'t have a pairing code or service name.');
          return;
        }

        device.version = version;

        const accessory = new DacpAccessory(this.api.hap, this.log, device);
        _accessories.push(accessory);
      });
    });

    callback(_accessories);
  }

  _createRemote(remote) {

    const remoteConfig = {
      pair: this._randomBaseString(16, 16).toUpperCase(),
      pairPasscode: this._randomBaseString(4, 10),
      deviceName: remote.name,
      deviceType: 'iPad'
    };
    const dacpRemote = new DacpRemote(remoteConfig, this.log);

    dacpRemote.on('paired', data => {
      this.log(`Added pairing for "${remote.name}":`);
      this.log(``);
      this.log(`{`);
      this.log(`  "name": "... name of the accessory ...",`);
      this.log(`  "pair": "${remoteConfig.pair}",`);
      this.log(`  "serviceName": "${data.serviceName}",`);
      this.log(`}`);
      this.log(``);
      this.log(`Please add the above block to the remote in your homebridge config.json`);
      this.log(``);
    });

    this._remotes.push(dacpRemote);
  }
}