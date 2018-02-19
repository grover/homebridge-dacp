"use strict";

const inherits = require('util').inherits;

module.exports = {
  registerWith: function (hap) {

    const Characteristic = hap.Characteristic;
    const Service = hap.Service;
    var UUIDGen = hap.uuid;

    ////////////////////////////////////////////////////////////////////////////
    // Sleep Characteristic
    ////////////////////////////////////////////////////////////////////////////
    Characteristic.Sleep = function () {
      Characteristic.call(this, 'Sleep', Characteristic.Sleep.UUID);
      this.setProps({
        format: Characteristic.Formats.BOOL,
        perms: [Characteristic.Perms.READ, Characteristic.Perms.WRITE, Characteristic.Perms.NOTIFY]
      });
      this.value = this.getDefaultValue();
    };

    Characteristic.Sleep.UUID = UUIDGen.generate("Sleep");
    inherits(Characteristic.Sleep, Characteristic);

    ////////////////////////////////////////////////////////////////////////////
    // SleepService Service
    ////////////////////////////////////////////////////////////////////////////
    Service.SleepService = function (displayName, subtype) {
      Service.call(this, displayName, Service.SleepService.UUID, subtype);

      // Required Characteristics
      this.addCharacteristic(Characteristic.Sleep);

      // Optional Characteristics
      this.addOptionalCharacteristic(Characteristic.Name);
    };

    Service.SleepService.UUID = UUIDGen.generate("SleepService");
    inherits(Service.SleepService, Service);
  }
};
