"use strict";

const inherits = require('util').inherits;

module.exports = {
  registerWith: function (hap) {

    const Characteristic = hap.Characteristic;
    const Service = hap.Service;

    Characteristic.PlaybackState = function () {
      Characteristic.call(this, 'Playback State', Characteristic.PlaybackState.UUID);
      this.setProps({
        format: Characteristic.Formats.UINT8,
        perms: [Characteristic.Perms.READ, Characteristic.Perms.WRITE, Characteristic.Perms.NOTIFY],
        maxValue: 2,
        minValue: 0,
        minStep: 1,
        validValues: [0, 1, 2]
      });
      this.value = this.getDefaultValue();
    };
    Characteristic.PlaybackState.UUID = '00002001-0000-1000-8000-135D67EC4377';
    inherits(Characteristic.PlaybackState, Characteristic);

    Characteristic.PlaybackState.PLAYING = 0;
    Characteristic.PlaybackState.PAUSED = 1;
    Characteristic.PlaybackState.STOPPED = 2;

    Characteristic.SkipForward = function () {
      Characteristic.call(this, 'Skip Forward', Characteristic.SkipForward.UUID);
      this.setProps({
        format: Characteristic.Formats.BOOL,
        perms: [Characteristic.Perms.WRITE]
      });
      this.value = this.getDefaultValue();
    };
    Characteristic.SkipForward.UUID = '00002002-0000-1000-8000-135D67EC4377';
    inherits(Characteristic.SkipForward, Characteristic);

    Characteristic.SkipBackward = function () {
      Characteristic.call(this, 'Skip Backward', Characteristic.SkipBackward.UUID);
      this.setProps({
        format: Characteristic.Formats.BOOL,
        perms: [Characteristic.Perms.WRITE]
      });
      this.value = this.getDefaultValue();
    };
    Characteristic.SkipBackward.UUID = '00002003-0000-1000-8000-135D67EC4377';
    inherits(Characteristic.SkipBackward, Characteristic);

    Characteristic.ShuffleMode = function () {
      Characteristic.call(this, 'Shuffle Mode', Characteristic.ShuffleMode.UUID);
      this.setProps({
        format: Characteristic.Formats.UINT8,
        perms: [Characteristic.Perms.READ, Characteristic.Perms.WRITE, Characteristic.Perms.NOTIFY],
        maxValue: 4,
        minValue: 0,
        minStep: 1,
        validValues: [0, 1, 2, 3, 4]
      });
      this.value = this.getDefaultValue();
    };
    Characteristic.ShuffleMode.UUID = '00002004-0000-1000-8000-135D67EC4377';
    inherits(Characteristic.ShuffleMode, Characteristic);

    //NOTE: If GROUP or SET is not supported, accessories should coerce to ALBUM.
    // If ALBUM is not supported, coerce to ITEM.
    // In general, it is recommended for apps to only assume OFF, ITEM, and ALBUM
    // are supported unless it is known that the accessory supports other settings.
    Characteristic.ShuffleMode.OFF = 0;
    //NOTE: INDIVIDUAL is deprecated.
    Characteristic.ShuffleMode.ITEM = Characteristic.ShuffleMode.INDIVIDUAL = 1;
    Characteristic.ShuffleMode.GROUP = 2; // e.g. iTunes "Groupings"
    Characteristic.ShuffleMode.ALBUM = 3; // e.g. album or season
    Characteristic.ShuffleMode.SET = 4; // e.g. T.V. Series or album box set

    Characteristic.RepeatMode = function () {
      Characteristic.call(this, 'Repeat Mode', Characteristic.RepeatMode.UUID);
      this.setProps({
        format: Characteristic.Formats.UINT8,
        perms: [Characteristic.Perms.READ, Characteristic.Perms.WRITE, Characteristic.Perms.NOTIFY],
        maxValue: 2,
        minValue: 0,
        minStep: 1,
        validValues: [0, 1, 2]
      });
      this.value = this.getDefaultValue();
    };
    Characteristic.RepeatMode.UUID = '00002005-0000-1000-8000-135D67EC4377';
    inherits(Characteristic.RepeatMode, Characteristic);
    Characteristic.RepeatMode.OFF = 0;
    Characteristic.RepeatMode.ONE = 1;
    Characteristic.RepeatMode.ALL = 2;

    Characteristic.PlaybackSpeed = function () {
      Characteristic.call(this, 'Playback Speed', Characteristic.PlaybackSpeed.UUID);
      this.setProps({
        format: Characteristic.Formats.FLOAT,
        perms: [Characteristic.Perms.READ, Characteristic.Perms.WRITE, Characteristic.Perms.NOTIFY]
      });
      this.value = this.getDefaultValue();
    };
    Characteristic.PlaybackSpeed.UUID = '00002006-0000-1000-8000-135D67EC4377';
    inherits(Characteristic.PlaybackSpeed, Characteristic);

    Characteristic.MediaCurrentPosition = function () {
      Characteristic.call(this, 'Position', Characteristic.MediaCurrentPosition.UUID);
      this.setProps({
        format: Characteristic.Formats.FLOAT, // In seconds
        perms: [Characteristic.Perms.READ, Characteristic.Perms.NOTIFY]
      });
      this.value = this.getDefaultValue();
    };
    Characteristic.MediaCurrentPosition.UUID = '00002007-0000-1000-8000-135D67EC4377';
    inherits(Characteristic.MediaCurrentPosition, Characteristic);

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

    Characteristic.MediaItemDuration = function () {
      Characteristic.call(this, 'Duration', Characteristic.MediaItemDuration.UUID);
      this.setProps({
        format: Characteristic.Formats.FLOAT, // In seconds
        perms: [Characteristic.Perms.READ, Characteristic.Perms.NOTIFY]
      });
      this.value = this.getDefaultValue();
    };
    Characteristic.MediaItemDuration.UUID = '00003005-0000-1000-8000-135D67EC4377';
    inherits(Characteristic.MediaItemDuration, Characteristic);


    Service.PlaybackDeviceService = function (displayName, subtype) {
      Service.call(this, displayName, Service.PlaybackDeviceService.UUID, subtype);

      // Required Characteristics
      this.addCharacteristic(Characteristic.PlaybackState);

      // Optional Characteristics
      this.addOptionalCharacteristic(Characteristic.SkipForward);
      this.addOptionalCharacteristic(Characteristic.SkipBackward);
      this.addOptionalCharacteristic(Characteristic.ShuffleMode);
      this.addOptionalCharacteristic(Characteristic.RepeatMode);
      this.addOptionalCharacteristic(Characteristic.PlaybackSpeed);
      this.addOptionalCharacteristic(Characteristic.Name);
    };
    Service.PlaybackDeviceService.UUID = '7806B1F8-AA8B-43E2-97BB-8BB847149A89';
    inherits(Service.PlaybackDeviceService, Service);

    Service.NowPlayingService = function (displayName, subtype) {
      Service.call(this, displayName, Service.NowPlayingService.UUID, subtype);

      // Required Characteristics
      this.addOptionalCharacteristic(Characteristic.Title);

      // Optional Characteristics
      this.addOptionalCharacteristic(Characteristic.Album);
      this.addOptionalCharacteristic(Characteristic.Artist);
      this.addOptionalCharacteristic(Characteristic.MediaCurrentPosition);
      this.addOptionalCharacteristic(Characteristic.MediaItemDuration);
      this.addOptionalCharacteristic(Characteristic.Name);
    };

    Service.NowPlayingService.UUID = 'F7138C87-EABF-420A-BFF0-76FC04DD81CD';
    inherits(Service.NowPlayingService, Service);
  }
}