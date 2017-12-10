"use strict";

const inherits = require('util').inherits;

module.exports = {
  registerWith: function (hap) {

    const Characteristic = hap.Characteristic;
    const Service = hap.Service;

    ////////////////////////////////////////////////////////////////////////////
    // SkipForward Characteristic
    ////////////////////////////////////////////////////////////////////////////
    Characteristic.SkipForward = function () {
      Characteristic.call(this, 'Skip >', Characteristic.SkipForward.UUID);
      this.setProps({
        format: Characteristic.Formats.BOOL,
        perms: [Characteristic.Perms.READ, Characteristic.Perms.WRITE, Characteristic.Perms.NOTIFY]
      });
      this.value = this.getDefaultValue();
    };
    Characteristic.SkipForward.UUID = 'CD56B40B-F98B-4ACA-BF5E-4AD4E9C77D1C';
    inherits(Characteristic.SkipForward, Characteristic);

    ////////////////////////////////////////////////////////////////////////////
    // SkipBackward Characteristic
    ////////////////////////////////////////////////////////////////////////////
    Characteristic.SkipBackward = function () {
      Characteristic.call(this, 'Skip <', Characteristic.SkipBackward.UUID);
      this.setProps({
        format: Characteristic.Formats.BOOL,
        perms: [Characteristic.Perms.READ, Characteristic.Perms.WRITE, Characteristic.Perms.NOTIFY]
      });
      this.value = this.getDefaultValue();
    };
    Characteristic.SkipBackward.UUID = 'CFFE477D-70C8-4630-B33B-25073F137191';
    inherits(Characteristic.SkipBackward, Characteristic);

    ////////////////////////////////////////////////////////////////////////////
    // Now Playing Service
    ////////////////////////////////////////////////////////////////////////////
    Service.MediaSkippingService = function (displayName, subtype) {
      Service.call(this, displayName, Service.MediaSkippingService.UUID, subtype);

      // Required Characteristics
      this.addCharacteristic(Characteristic.SkipForward);
      this.addCharacteristic(Characteristic.SkipBackward);

      // Optional Characteristics
      this.addOptionalCharacteristic(Characteristic.Name);
    };

    Service.MediaSkippingService.UUID = '07163D16-8F0E-4B36-9AC4-18BE183B9EDE';
    inherits(Service.MediaSkippingService, Service);
  }
};