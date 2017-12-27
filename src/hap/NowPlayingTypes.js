"use strict";

const inherits = require('util').inherits;

module.exports = {
  registerWith: function (hap) {

    const Characteristic = hap.Characteristic;
    const Service = hap.Service;

    ////////////////////////////////////////////////////////////////////////////
    // Title Characteristic
    ////////////////////////////////////////////////////////////////////////////
    Characteristic.Title = function () {
      Characteristic.call(this, 'Title', Characteristic.Title.UUID);
      this.setProps({
        format: Characteristic.Formats.STRING,
        perms: [Characteristic.Perms.READ, Characteristic.Perms.NOTIFY]
      });
      this.value = this.getDefaultValue();
    };
    Characteristic.Title.UUID = '00003001-0000-1000-8000-135D67EC4377';
    inherits(Characteristic.Title, Characteristic);

    ////////////////////////////////////////////////////////////////////////////
    // Album Characteristic
    ////////////////////////////////////////////////////////////////////////////    
    Characteristic.Album = function () {
      Characteristic.call(this, 'Album', Characteristic.Album.UUID);
      this.setProps({
        format: Characteristic.Formats.STRING,
        perms: [Characteristic.Perms.READ, Characteristic.Perms.NOTIFY]
      });
      this.value = this.getDefaultValue();
    };
    Characteristic.Album.UUID = '00003002-0000-1000-8000-135D67EC4377';
    inherits(Characteristic.Album, Characteristic);

    ////////////////////////////////////////////////////////////////////////////
    // Artist Characteristic
    ////////////////////////////////////////////////////////////////////////////
    Characteristic.Artist = function () {
      Characteristic.call(this, 'Artist', Characteristic.Artist.UUID);
      this.setProps({
        format: Characteristic.Formats.STRING,
        perms: [Characteristic.Perms.READ, Characteristic.Perms.NOTIFY]
      });
      this.value = this.getDefaultValue();
    };
    Characteristic.Artist.UUID = '00003003-0000-1000-8000-135D67EC4377';
    inherits(Characteristic.Artist, Characteristic);

    ////////////////////////////////////////////////////////////////////////////
    // Genre Characteristic
    ////////////////////////////////////////////////////////////////////////////
    Characteristic.Genre = function () {
      Characteristic.call(this, 'Genre', Characteristic.Genre.UUID);
      this.setProps({
        format: Characteristic.Formats.STRING,
        perms: [Characteristic.Perms.READ, Characteristic.Perms.NOTIFY]
      });
      this.value = this.getDefaultValue();
    };
    Characteristic.Genre.UUID = '8087750B-8B8C-451E-B907-8E3BAD8DCB1E';
    inherits(Characteristic.Genre, Characteristic);

    ////////////////////////////////////////////////////////////////////////////
    // Media Type Characteristic
    ////////////////////////////////////////////////////////////////////////////
    Characteristic.MediaType = function () {
      Characteristic.call(this, 'Media Type', Characteristic.MediaType.UUID);
      this.setProps({
        format: Characteristic.Formats.INT,
        maxValue: 64,
        minValue: 0,
        perms: [Characteristic.Perms.READ, Characteristic.Perms.NOTIFY]
      });
      this.value = this.getDefaultValue();
    };
    Characteristic.MediaType.UUID = '9898982C-7B70-47AD-A81D-211BFE5AFBF2';
    inherits(Characteristic.MediaType, Characteristic);

    ////////////////////////////////////////////////////////////////////////////
    // Position Characteristic
    ////////////////////////////////////////////////////////////////////////////
    Characteristic.MediaCurrentPosition = function () {
      Characteristic.call(this, 'Position', Characteristic.MediaCurrentPosition.UUID);
      this.setProps({
        format: Characteristic.Formats.STRING,
        perms: [Characteristic.Perms.READ, Characteristic.Perms.NOTIFY]
      });
      this.value = this.getDefaultValue();
    };
    Characteristic.MediaCurrentPosition.UUID = '00002007-0000-1000-8000-135D67EC4377';
    inherits(Characteristic.MediaCurrentPosition, Characteristic);

    ////////////////////////////////////////////////////////////////////////////
    // Duration Characteristic
    ////////////////////////////////////////////////////////////////////////////
    Characteristic.MediaItemDuration = function () {
      Characteristic.call(this, 'Duration', Characteristic.MediaItemDuration.UUID);
      this.setProps({
        format: Characteristic.Formats.STRING, // In seconds
        perms: [Characteristic.Perms.READ, Characteristic.Perms.NOTIFY]
      });
      this.value = this.getDefaultValue();
    };
    Characteristic.MediaItemDuration.UUID = '00003005-0000-1000-8000-135D67EC4377';
    inherits(Characteristic.MediaItemDuration, Characteristic);

    ////////////////////////////////////////////////////////////////////////////
    // Now Playing Service
    ////////////////////////////////////////////////////////////////////////////
    Service.NowPlayingService = function (displayName, subtype) {
      Service.call(this, displayName, Service.NowPlayingService.UUID, subtype);

      // Required Characteristics
      this.addCharacteristic(Characteristic.Title);

      // Optional Characteristics
      this.addOptionalCharacteristic(Characteristic.Album);
      this.addOptionalCharacteristic(Characteristic.Artist);
      this.addOptionalCharacteristic(Characteristic.Genre);
      this.addOptionalCharacteristic(Characteristic.MediaType);
      this.addOptionalCharacteristic(Characteristic.MediaCurrentPosition);
      this.addOptionalCharacteristic(Characteristic.MediaItemDuration);
      this.addOptionalCharacteristic(Characteristic.Name);
    };

    Service.NowPlayingService.UUID = 'F7138C87-EABF-420A-BFF0-76FC04DD81CD';
    inherits(Service.NowPlayingService, Service);
  }
};
