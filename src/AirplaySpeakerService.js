'use strict';

const util = require('util');

let Characteristic, Service;

class AirplaySpeakerService {

  constructor(homebridge, log, name, dacp, config) {
    Characteristic = homebridge.Characteristic;
    Service = homebridge.Service;

    this.log = log;
    this.name = name;
    this._dacp = dacp;
    this._config = config;
    this._timeout = undefined;

    this._speakerCharacteristics = {};
    this._visibleSpeakers = [];

    this._service = this.createService();
  }

  getService() {
    return this._service;
  }

  createService() {
    const svc = new Service.AirplaySpeakerService(`${this.name} Speakers`);

    this._config.speakers.forEach(speaker => {
      const c = new Characteristic.SelectSpeaker(speaker);
      c.on('set', this._selectSpeaker.bind(this, speaker, c))
        .updateValue(false);

      svc.addCharacteristic(c);
      this._speakerCharacteristics[speaker] = c;
    });

    return svc;
  }

  async _selectSpeaker(speaker, characteristic, value, callback) {
    const data = this._visibleSpeakers.find(s => s.name === speaker);
    if (!data) {
      this.log(`Speaker ${speaker} is not visible to the DACP server.`);
      callback(new Error('Invisible'));
      return;
    }

    data.isActive = value;
    try {
      await this._updateSpeakerStatus();
      callback();
    }
    catch (e) {
      this.log(`Failed to update speaker status: ${e.response.statusCode}`);
      callback(e);
    }

    await this.update();
  }

  async _updateSpeakerStatus() {
    const speakerIds = this._visibleSpeakers
      .filter(speaker => speaker.isActive)
      .map(speaker => speaker.id)
      .join(',');

    await this._dacp.setSpeakers(speakerIds);
  }

  async update() {
    try {
      const response = await this._dacp.getSpeakers();
      if (response && response.casp !== undefined) {
        this._updateSpeakerList(response.casp);
        this._reflectSpeakerStatus();
      }
    }
    catch (error) {
      this.log(`Failed to retrieve speaker volume ${util.inspect(error)}`);
    }
  }

  _updateSpeakerList(casp) {
    this._visibleSpeakers = [];

    casp.forEach(speaker => {
      this._visibleSpeakers.push({
        name: speaker.minm,
        id: speaker.msma,
        isActive: speaker.caia === 1
      });
    });
  }

  _reflectSpeakerStatus() {
    this._visibleSpeakers.forEach(speaker => {
      const c = this._speakerCharacteristics[speaker.name];
      if (c) {
        c.updateValue(speaker.isActive);
      }
    });
  }
};

module.exports = AirplaySpeakerService;
