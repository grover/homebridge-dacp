'use strict';

const inherits = require('util').inherits;

module.exports = {
  registerWith: function (hap) {

    const Characteristic = hap.Characteristic;
    const Service = hap.Service;

    ////////////////////////////////////////////////////////////////////////////
    // SelectSpeaker Characteristic
    ////////////////////////////////////////////////////////////////////////////
    Characteristic.SelectSpeaker = function (displayName) {

      const uuid = hap.uuid.generate(displayName).toUpperCase();
      Characteristic.call(this, displayName, uuid);

      this.setProps({
        format: Characteristic.Formats.BOOL,
        perms: [Characteristic.Perms.READ, Characteristic.Perms.WRITE, Characteristic.Perms.NOTIFY]
      });
      this.value = this.getDefaultValue();
    };
    inherits(Characteristic.SelectSpeaker, Characteristic);

    ////////////////////////////////////////////////////////////////////////////
    // AirplaySpeakerService Service
    ////////////////////////////////////////////////////////////////////////////
    Service.AirplaySpeakerService = function (displayName, subtype) {
      Service.call(this, displayName, Service.AirplaySpeakerService.UUID, subtype);

      // Optional Characteristics
      this.addOptionalCharacteristic(Characteristic.Name);
    };

    Service.AirplaySpeakerService.UUID = '007B1B43-3AFB-449C-933C-AA9ABC2DB37A';
    inherits(Service.AirplaySpeakerService, Service);
  }
};