'use strict';

let Characteristic, Service;

const util = require('util');

const MacroCommands = require('./MacroCommands');

class MacrosService {

  constructor(homebridge, log, name, dacp, macros) {
    Characteristic = homebridge.Characteristic;
    Service = homebridge.Service;

    this.log = log;
    this.name = name;
    this._dacp = dacp;
    this._timeout = undefined;

    this._commands = {
      'topmenu': this._execKey.bind(this, MacroCommands['topmenu']),
      'menu': this._execKey.bind(this, MacroCommands['menu']),
      'select': this._execKey.bind(this, MacroCommands['select']),
      'up': this._execKey.bind(this, MacroCommands['up']),
      'down': this._execKey.bind(this, MacroCommands['down']),
      'left': this._execKey.bind(this, MacroCommands['left']),
      'right': this._execKey.bind(this, MacroCommands['right']),
      'wait5s': this._execWait.bind(this, 5)
    };

    this._createServices(macros);
  }

  getService() {
    return this._services;
  }

  _createServices(macros) {

    this._services = [];

    for (const name of Object.keys(macros)) {
      const sw = this._createKeyService(name, macros[name]);
      this._services.push(sw);
    }
  }

  _createKeyService(title, macro) {
    const svc = new Service.Switch(`${title}`, `macro-${title}`);
    this._bindAssignmentHandler(svc, Characteristic.On, title, macro);
    return svc;
  }

  _bindAssignmentHandler(svc, characteristic, title, macro) {
    const c = svc.getCharacteristic(characteristic);
    c.on('set', this._onKeyPress.bind(this, title, macro, c));
  }

  async _onKeyPress(title, macro, characteristic, value, callback) {
    if (!value) {
      callback();
      return;
    }

    this.log(`Execute macro '${title}'`);
    try {
      callback();

      for (const cmd of macro) {
        const fn = this._commands[cmd];
        await fn();
      }
    }
    catch (error) {
      this.log(`Failed to execute '${title}'. Error: ${util.inspect(error)}`);
      callback(error);
    }

    this._resetCharacteristics(characteristic);
  }

  _resetCharacteristics(characteristic) {
    setTimeout(() => characteristic.updateValue(false), 100);
  }

  async _execKey(commands) {
    for (const cmd of commands) {
      await this._dacp.sendRemoteKey(cmd);
    }
  }

  async _execWait(duration) {
    await new Promise(resolve => setTimeout(resolve, duration * 1000));
  }
}

module.exports = MacrosService;
