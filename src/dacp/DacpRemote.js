'use strict';

const EventEmitter = require('events').EventEmitter;
const crypto = require('crypto');
const http = require('http');
const bonjour = require('bonjour')();
const querystring = require('querystring');

class DacpRemote extends EventEmitter {

  constructor(config, log) {
    super();

    this.config = config;
    this.log = log;

    var txtRecord = {
      'DvNm': this.config.deviceName,
      'DvTy': this.config.deviceType,
      'Pair': this.config.pair,
      'RemV': '10000',
      'RemN': 'Remote',
      'txtvers': '1'
    };

    this._httpServer = http.createServer(this._handleRequest.bind(this));
    this._httpServer.listen();

    this._ad = bonjour.publish({
      name: this.config.deviceName,
      port: this._httpServer.address().port,
      type: 'touch-remote',
      protocol: 'tcp',
      txt: txtRecord
    });

    this._pairingHash = this._buildPairingHash(this.config.pair, this.config.pairPasscode);
  }

  _handleRequest(request, response) {

    const query = querystring.parse(request.url.substring(request.url.indexOf('?') + 1));

    if (query.servicename && query.pairingcode && query.pairingcode.toUpperCase() == this._pairingHash.toUpperCase()) {
      this.emit('paired', { serviceName: query.servicename });
      this._sendPairingSuccess(response);
    }
    else {
      this._sendPairingFailure(response);
    }

  }

  _sendPairingSuccess(response) {
    const values = {
      'cmpg': this._newBuffer(this.config.pair, 'hex'),
      'cmnm': this.config.deviceName,
      'cmty': this.config.deviceType
    };

    const buffers = [];

    for (var property in values) {
      if (values.hasOwnProperty(property)) {
        const valBuffer = this._newBuffer(values[property]);
        const lenBuffer = this._newBuffer(this._binaryLength(valBuffer.length));
        const propBuffer = this._newBuffer(property);
        buffers.push(propBuffer, lenBuffer, valBuffer);
      }
    }

    var body = Buffer.concat(buffers);
    var header = Buffer.concat([this._newBuffer('cmpa'), this._newBuffer(this._binaryLength(body.length))]);
    var encoded = Buffer.concat([header, body]);

    response.writeHead(200, {
      'Content-Length': encoded.length
    });

    response.end(encoded);
  }

  _sendPairingFailure(response) {
    response.writeHead(404, {
      'Content-Length': '0'
    });
    response.end();
  }

  _newBuffer(contents, type) {
    return typeof Buffer.from == 'function' ? Buffer.from(contents, type) : new Buffer(contents, type);
  }

  _binaryLength(length) {
    var ascii = '';
    for (var i = 3; i >= 0; i--) {
      ascii += String.fromCharCode((length >> (8 * i)) & 255);
    }
    return ascii;
  }

  _buildPairingHash(pair, passcode) {
    var merged = pair;

    for (var ctr = 0; ctr < passcode.length; ctr++)
      merged += passcode[ctr] + '\x00';

    return crypto.createHash('md5').update(merged).digest('hex');
  }

  start() {
    this.log(`Starting DACP remote announcements for "${this.config.deviceName}" - pin "${this.config.pairPasscode}"...`);
    this._ad.start();
  }

  stop() {
    this._ad.stop();
    this._httpServer.close();
  }
}

module.exports = DacpRemote;