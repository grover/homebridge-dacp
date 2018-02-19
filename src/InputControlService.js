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

  constructor(homebridge, log, name, dacp, features) {
    Characteristic = homebridge.Characteristic;
    Service = homebridge.Service;

    this.log = log;
    this.name = name;
    this._dacp = dacp;
    this._timeout = undefined;

    this.createServices(features);
  }

  getService() {
    return this._services;
  }

  createServices(features) {
    const useInputControls = features['input-controls'];
    const useAlternateInputControls = features['alternate-input-controls'];

    if (useInputControls) {
      this._createInputControlService();
    }
    else if (useAlternateInputControls) {
      this._createAlternateInputControls(useAlternateInputControls);
    }
  }

  _createInputControlService() {
    this._services = [
      new Service.InputControlService(`${this.name} Remote`)
    ];

    this._characteristics = [
      this._services[0].getCharacteristic(Characteristic.TopMenuButton).on('set', this._onKeyPress.bind(this, 'Topmenu', cmds.topmenu)),
      this._services[0].getCharacteristic(Characteristic.MenuButton).on('set', this._onKeyPress.bind(this, 'Menu', cmds.menu)),
      this._services[0].getCharacteristic(Characteristic.SelectButton).on('set', this._onKeyPress.bind(this, 'Select', cmds.select)),
      this._services[0].getCharacteristic(Characteristic.UpButton).on('set', this._onKeyPress.bind(this, 'Up', cmds.up)),
      this._services[0].getCharacteristic(Characteristic.DownButton).on('set', this._onKeyPress.bind(this, 'Down', cmds.down)),
      this._services[0].getCharacteristic(Characteristic.LeftButton).on('set', this._onKeyPress.bind(this, 'Left', cmds.left)),
      this._services[0].getCharacteristic(Characteristic.RightButton).on('set', this._onKeyPress.bind(this, 'Right', cmds.right)),
    ];
  }

  _createAlternateInputControls(alternateControls) {
    this._services = [
      this._createKeyService(alternateControls, 'Topmenu', cmds.topmenu),
      this._createKeyService(alternateControls, 'Menu', cmds.menu),
      this._createKeyService(alternateControls, 'Select', cmds.select),
      this._createKeyService(alternateControls, 'Up', cmds.up),
      this._createKeyService(alternateControls, 'Down', cmds.down),
      this._createKeyService(alternateControls, 'Left', cmds.left),
      this._createKeyService(alternateControls, 'Right', cmds.right)
    ].filter(s => s != undefined);

    this._characteristics = this._services.map(svc => svc.getCharacteristic(Characteristic.On));
  }

  _createKeyService(features, title, commands) {
    if (features !== true && features instanceof Array) {
      if (!features.includes(title.toLowerCase())) {
        return;
      }
    }

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
      this._characteristics.forEach(c => c.updateValue(false));
    }, 100);
  }
};

module.exports = InputControlService;
