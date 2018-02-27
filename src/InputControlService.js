'use strict';

let Characteristic, Service;

const MacroCommands = require('./MacroCommands');

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
    const svc = new Service.InputControlService(`${this.name} Remote`);

    const buttons = [
      { c: Characteristic.TopMenuButton, title: 'Topmenu', commands: MacroCommands.topmenu },
      { c: Characteristic.MenuButton, title: 'Menu', commands: MacroCommands.menu },
      { c: Characteristic.SelectButton, title: 'Select', commands: MacroCommands.select },
      { c: Characteristic.UpButton, title: 'Up', commands: MacroCommands.up },
      { c: Characteristic.DownButton, title: 'Down', commands: MacroCommands.down },
      { c: Characteristic.LeftButton, title: 'Left', commands: MacroCommands.left },
      { c: Characteristic.RightButton, title: 'Right', commands: MacroCommands.right }
    ];

    buttons.forEach(entry => {
      this._bindAssignmentHandler(svc, entry.c, entry.title, entry.commands);
    });

    this._services = [svc];
  }

  _createAlternateInputControls(alternateControls) {
    this._services = [
      this._createKeyService(alternateControls, 'Topmenu', MacroCommands.topmenu),
      this._createKeyService(alternateControls, 'Menu', MacroCommands.menu),
      this._createKeyService(alternateControls, 'Select', MacroCommands.select),
      this._createKeyService(alternateControls, 'Up', MacroCommands.up),
      this._createKeyService(alternateControls, 'Down', MacroCommands.down),
      this._createKeyService(alternateControls, 'Left', MacroCommands.left),
      this._createKeyService(alternateControls, 'Right', MacroCommands.right)
    ].filter(s => s != undefined);
  }

  _createKeyService(features, title, commands) {
    if (features !== true && features instanceof Array) {
      if (!features.includes(title.toLowerCase())) {
        return;
      }
    }

    const svc = new Service.Switch(`${this.name} ${title}`, `input - ${title}`);
    this._bindAssignmentHandler(svc, Characteristic.On, title, commands);

    return svc;
  }

  _bindAssignmentHandler(svc, characteristic, title, commands) {
    const c = svc.getCharacteristic(characteristic);
    c.on('set', this._onKeyPress.bind(this, title, commands, c));
    return c;
  }

  async _onKeyPress(title, commands, characteristic, value, callback) {
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

    this._resetCharacteristics(characteristic);
  }

  _resetCharacteristics(characteristic) {
    setTimeout(() => characteristic.updateValue(false), 100);
  }
}

module.exports = InputControlService;
