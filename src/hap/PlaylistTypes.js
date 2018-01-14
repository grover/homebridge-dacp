"use strict";

const inherits = require('util').inherits;

module.exports = {
  registerWith: function (hap) {

    const Characteristic = hap.Characteristic;
    const Service = hap.Service;

    ////////////////////////////////////////////////////////////////////////////
    // PlayPause Characteristic
    ////////////////////////////////////////////////////////////////////////////
    Characteristic.StartPlaylist = function (displayName) {

      const uuid = hap.uuid.generate(displayName);
      Characteristic.call(this, displayName, uuid);

      this.setProps({
        format: Characteristic.Formats.BOOL,
        perms: [Characteristic.Perms.READ, Characteristic.Perms.WRITE, Characteristic.Perms.NOTIFY]
      });
      this.value = this.getDefaultValue();
    };
    inherits(Characteristic.StartPlaylist, Characteristic);

    ////////////////////////////////////////////////////////////////////////////
    // PlayerControlsService Service
    ////////////////////////////////////////////////////////////////////////////
    Service.PlaylistControlService = function (displayName, subtype) {
      Service.call(this, displayName, Service.PlaylistControlService.UUID, subtype);

      // Optional Characteristics
      this.addOptionalCharacteristic(Characteristic.Name);
    };

    Service.PlaylistControlService.UUID = '24B5B813-8D9C-49C3-ABFB-EDE879A4FF99';
    inherits(Service.PlaylistControlService, Service);
  }
};