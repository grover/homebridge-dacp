'use strict';

const inherits = require('util').inherits;

module.exports = {
  registerWith: function (hap) {

    const Characteristic = hap.Characteristic;
    const Service = hap.Service;

    ////////////////////////////////////////////////////////////////////////////
    // Top Menu Characteristic
    ////////////////////////////////////////////////////////////////////////////
    Characteristic.TopMenuButton = function () {
      Characteristic.call(this, 'Top Menu', Characteristic.TopMenuButton.UUID);
      this.setProps({
        format: Characteristic.Formats.BOOL,
        perms: [Characteristic.Perms.READ, Characteristic.Perms.WRITE, Characteristic.Perms.NOTIFY]
      });
      this.value = this.getDefaultValue();
    };
    Characteristic.TopMenuButton.UUID = '53426A9B-1AB0-44CB-B88B-82D96EFC51CE';
    inherits(Characteristic.TopMenuButton, Characteristic);

    ////////////////////////////////////////////////////////////////////////////
    // Menu Characteristic
    ////////////////////////////////////////////////////////////////////////////
    Characteristic.MenuButton = function () {
      Characteristic.call(this, 'Menu', Characteristic.MenuButton.UUID);
      this.setProps({
        format: Characteristic.Formats.BOOL,
        perms: [Characteristic.Perms.READ, Characteristic.Perms.WRITE, Characteristic.Perms.NOTIFY]
      });
      this.value = this.getDefaultValue();
    };
    Characteristic.MenuButton.UUID = 'CB68261D-DB68-46B8-B1F0-5BDFEC872039';
    inherits(Characteristic.MenuButton, Characteristic);

    ////////////////////////////////////////////////////////////////////////////
    // Select Characteristic
    ////////////////////////////////////////////////////////////////////////////
    Characteristic.SelectButton = function () {
      Characteristic.call(this, 'Select', Characteristic.SelectButton.UUID);
      this.setProps({
        format: Characteristic.Formats.BOOL,
        perms: [Characteristic.Perms.READ, Characteristic.Perms.WRITE, Characteristic.Perms.NOTIFY]
      });
      this.value = this.getDefaultValue();
    };
    Characteristic.SelectButton.UUID = 'C67044BB-EE9F-4F72-9816-FEE962BE1EB1';
    inherits(Characteristic.SelectButton, Characteristic);

    ////////////////////////////////////////////////////////////////////////////
    // Up Characteristic
    ////////////////////////////////////////////////////////////////////////////
    Characteristic.UpButton = function () {
      Characteristic.call(this, 'Up', Characteristic.UpButton.UUID);
      this.setProps({
        format: Characteristic.Formats.BOOL,
        perms: [Characteristic.Perms.READ, Characteristic.Perms.WRITE, Characteristic.Perms.NOTIFY]
      });
      this.value = this.getDefaultValue();
    };
    Characteristic.UpButton.UUID = '3B005F2F-E2AE-4895-A37E-53280E2EA764';
    inherits(Characteristic.UpButton, Characteristic);

    ////////////////////////////////////////////////////////////////////////////
    // Down Characteristic
    ////////////////////////////////////////////////////////////////////////////
    Characteristic.DownButton = function () {
      Characteristic.call(this, 'Down', Characteristic.DownButton.UUID);
      this.setProps({
        format: Characteristic.Formats.BOOL,
        perms: [Characteristic.Perms.READ, Characteristic.Perms.WRITE, Characteristic.Perms.NOTIFY]
      });
      this.value = this.getDefaultValue();
    };
    Characteristic.DownButton.UUID = 'B17E1EC9-314B-46F1-97D5-0A371B662D2A';
    inherits(Characteristic.DownButton, Characteristic);

    ////////////////////////////////////////////////////////////////////////////
    // Left Characteristic
    ////////////////////////////////////////////////////////////////////////////
    Characteristic.LeftButton = function () {
      Characteristic.call(this, 'Left', Characteristic.LeftButton.UUID);
      this.setProps({
        format: Characteristic.Formats.BOOL,
        perms: [Characteristic.Perms.READ, Characteristic.Perms.WRITE, Characteristic.Perms.NOTIFY]
      });
      this.value = this.getDefaultValue();
    };
    Characteristic.LeftButton.UUID = '76261837-BFE3-413B-9803-36122EE1D994';
    inherits(Characteristic.LeftButton, Characteristic);

    ////////////////////////////////////////////////////////////////////////////
    // Right Characteristic
    ////////////////////////////////////////////////////////////////////////////
    Characteristic.RightButton = function () {
      Characteristic.call(this, 'Right', Characteristic.RightButton.UUID);
      this.setProps({
        format: Characteristic.Formats.BOOL,
        perms: [Characteristic.Perms.READ, Characteristic.Perms.WRITE, Characteristic.Perms.NOTIFY]
      });
      this.value = this.getDefaultValue();
    };
    Characteristic.RightButton.UUID = 'A3DECC2A-4852-4347-A548-9972E0490891';
    inherits(Characteristic.RightButton, Characteristic);

    ////////////////////////////////////////////////////////////////////////////
    // Input Control Service
    ////////////////////////////////////////////////////////////////////////////
    Service.InputControlService = function (displayName, subtype) {
      Service.call(this, displayName, Service.InputControlService.UUID, subtype);

      // Required Characteristics
      this.addCharacteristic(Characteristic.TopMenuButton);
      this.addCharacteristic(Characteristic.MenuButton);
      this.addCharacteristic(Characteristic.SelectButton);
      this.addCharacteristic(Characteristic.UpButton);
      this.addCharacteristic(Characteristic.DownButton);
      this.addCharacteristic(Characteristic.LeftButton);
      this.addCharacteristic(Characteristic.RightButton);

      // Optional Characteristics
      this.addOptionalCharacteristic(Characteristic.Name);
    };

    Service.InputControlService.UUID = '5F862E4E-9D42-4636-9F1E-0D4BC5572705';
    inherits(Service.InputControlService, Service);
  }
};