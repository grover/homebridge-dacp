'use strict';

const EventEmitter = require('events').EventEmitter;
const bonjour = require('bonjour')();

class DacpBrowser extends EventEmitter {

  constructor(log) {
    super();

    this.log = log;
  }

  start() {
    if (this._browser) {
      return;
    }

    this.log('Starting DACP browser...');
    this._browser = bonjour.find({
      type: 'touch-able',
      protocol: 'tcp'
    });

    this._browser.on('up', service => {
      this.emit('serviceUp', service);
    });

    this._browser.on('down', service => {
      this.emit('serviceDown', service);
    });

    this._browser.on('error', error => {
      this.emit('error', error);

      this.stop();
    });

    this._browser.start();
  }

  stop() {
    if (this._browser) {
      this._browser.stop();
      this._browser = undefined;
    }
  }
}

module.exports = DacpBrowser;