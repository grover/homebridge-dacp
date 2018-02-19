'use strict';

let Characteristic, Service;

const cmds = {
  'topmenu': [
    'topmenu'
  ],
  'menu': [
    'menu'
  ],
  'select': [
    'select'
  ],
  'up': [
    'touchDown&time=0&point=20,275',
    'touchMove&time=1&point=20,260',
    'touchMove&time=2&point=20,245',
    'touchMove&time=3&point=20,230',
    'touchMove&time=4&point=20,215',
    'touchMove&time=5&point=20,200',
    'touchUp&time=6&point=20,185'
  ],
  'down': [
    'touchDown&time=0&point=20,250',
    'touchMove&time=1&point=20,255',
    'touchMove&time=2&point=20,260',
    'touchMove&time=3&point=20,265',
    'touchMove&time=4&point=20,270',
    'touchMove&time=5&point=20,275',
    'touchUp&time=6&point=20,275'
  ],
  'left': [
    'touchDown&time=0&point=75,100',
    'touchMove&time=1&point=70,100',
    'touchMove&time=3&point=65,100',
    'touchMove&time=4&point=60,100',
    'touchMove&time=5&point=55,100',
    'touchMove&time=6&point=50,100',
    'touchUp&time=7&point=50,100'
  ],
  'right': [
    'touchDown&time=0&point=50,100',
    'touchMove&time=1&point=55,100',
    'touchMove&time=3&point=60,100',
    'touchMove&time=4&point=65,100',
    'touchMove&time=5&point=70,100',
    'touchMove&time=6&point=75,100',
    'touchUp&time=7&point=75,100'
  ]
};

class InputControlService {

  constructor(homebridge, log, name, dacp) {
    Characteristic = homebridge.Characteristic;
    Service = homebridge.Service;

    this.log = log;
    this.name = name;
    this._dacp = dacp;
    this._timeout = undefined;

    this.createServices();
  }

  getService() {
    return this._services;
  }

  createServices() {
    this._services = [
      this._createKeyService('Topmenu', cmds.topmenu),
      this._createKeyService('Menu', cmds.menu),
      this._createKeyService('Select', cmds.select),
      this._createKeyService('Up', cmds.up),
      this._createKeyService('Down', cmds.down),
      this._createKeyService('Left', cmds.left),
      this._createKeyService('Right', cmds.right)
    ];
  }

  _createKeyService(title, commands) {
    const svc = new Service.Switch(`${this.name} ${title}`, `input - ${title}`);
    svc.getCharacteristic(Characteristic.On)
      .on('set', this._onKeyPress.bind(this, title, commands));

    return svc;
  }

  async _onKeyPress(title, commands, value, callback) {
    if (!value) {
      callback();
      return;
    }

    this.log(`Simulate '${title}' key press`);

    try {
      for (const cmd of commands) {
        await this._dacp.sendRemoteKey(cmd);
      }

      callback();
    }
    catch (error) {
      this.log(`Failed to send the ${title} key request to the device.`);
      // TODO: Pass error back to HomeKit
      callback();
    }

    this._resetCharacteristics();
  }

  _resetCharacteristics() {
    setTimeout(() => {
      this._services.forEach(svc => {
        svc.getCharacteristic(Characteristic.On)
          .updateValue(false);
      });
    }, 100);
  }
};

module.exports = InputControlService;
