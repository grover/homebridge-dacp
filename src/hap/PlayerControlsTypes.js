"use strict";

const inherits = require('util').inherits;

module.exports = {
  registerWith: function (hap) {

    const Characteristic = hap.Characteristic;
    const Service = hap.Service;

    ////////////////////////////////////////////////////////////////////////////
    // PlayPause Characteristic
    ////////////////////////////////////////////////////////////////////////////
    Characteristic.PlayPause = function () {
      Characteristic.call(this, 'Play', Characteristic.PlayPause.UUID);
      this.setProps({
        format: Characteristic.Formats.BOOL,
        perms: [Characteristic.Perms.READ, Characteristic.Perms.WRITE, Characteristic.Perms.NOTIFY]
      });
      this.value = this.getDefaultValue();
    };
    Characteristic.PlayPause.UUID = 'BA16B86C-DC86-482A-A70C-CC9C924DB842';
    inherits(Characteristic.PlayPause, Characteristic);

    ////////////////////////////////////////////////////////////////////////////
    // PlayerControlsService Service
    ////////////////////////////////////////////////////////////////////////////
    Service.PlayerControlsService = function (displayName, subtype) {
      Service.call(this, displayName, Service.PlayerControlsService.UUID, subtype);

      // Required Characteristics
      this.addCharacteristic(Characteristic.PlayPause);

      // Optional Characteristics
      this.addOptionalCharacteristic(Characteristic.Name);
    };

    Service.PlayerControlsService.UUID = 'EFD51587-6F54-4093-9E8D-FA3975DCDCE6';
    inherits(Service.PlayerControlsService, Service);
  }
};