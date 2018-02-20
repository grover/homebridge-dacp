'use strict';

const util = require('util');
const EventEmitter = require('events').EventEmitter;

const mdns = require('mdns');
const mdnsResolver = require('mdns-resolver');

class DacpBrowser extends EventEmitter {

  constructor(log) {
    super();

    this.log = log;
  }

  start() {
    this.log('Starting DACP browser...');

    const ServiceName = 'touch-able';
    const ResolverSequence = [
      mdns.rst.DNSServiceResolve()
    ];

    this._browser = mdns.createBrowser(
      mdns.tcp(ServiceName),
      { resolverSequence: ResolverSequence });

    this._browser.on('serviceUp', this._onServiceUp.bind(this));

    this._browser.on('serviceDown', service => {
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

  _onServiceUp(service) {
    mdnsResolver.resolve4(service.host)
      .then(host => {
        service.host = host;
        return service;
      })
      .catch(e => {
        this.log(`Failed to resolve service ${service.host} using IPv4 MDNS lookups.`);
        this.log(`Specific error: ${util.inspect(e)}`);

        return mdnsResolver.resolve6(service.host)
          .then(host => {
            service.host = `[${host}]`;
            return service;
          });
      })
      .catch(e => {
        this.log(`Failed to resolve service ${service.host} using IPv4 and IPv6 MDNS lookups.`);
        this.log('Discarding service.');
        this.log(`Specific error: ${util.inspect(e)} `);
      })
      .then(service => {
        this.emit('serviceUp', service);
      });
  }
}

module.exports = DacpBrowser;