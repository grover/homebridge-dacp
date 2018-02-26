# Changelog

## Version 0.9 - 2018-02-28

- Added input control mechanisms for Apple TV
- Added macro execution mechanism for Apple TV
- Added album artwork support

## Version 0.8 - 2018-02-22

- Added support to trigger the playback of Playlists
- Improved error handling
- Added on demand DACP packet tracing
- Updated documentation

## Version 0.7.5 - 2017-12-27

#### Bugfixes

- Fix #6 (by @nitaybz): Limit the range of the media type characteristic to make rule creation easier.

## Version 0.7.4 - 2017-12-13

#### Bugfixes

- Bugfix for #4: IllegalStateError: Backoff in progress.

#### Alternate Play/Pause switch mode

iOS' Home app is unfortunately incompatible with custom services and 
characteristics. As such this plugin was not working for users of the Home app until
now. This version adds a configuration setting to change the mode that the 
play/pause button is published to enable Home to use it like a power switch.

## Version 0.7.3 - 2017-12-12

#### Bugfixes

- Fixed start issue `TypeError: Cannot read property 'name' of undefined`
- Fixed issue retrieving playback position from Apple TV causing needless reconnects

## Version 0.7.2 - 2017-12-10

Fixed missing changelog updates

## Version 0.7.1 - 2017-12-10

Fixed broken formatting in [README.md](README.md)

## Version 0.7.0 - 2017-12-10

#### Improved feature documentation

The [README.md](README.md) has an updated documentation of the features.

#### Renamed feature toggles

By default all features are available for all devices. Use feature toggles to
disable specific services.

For consistency reasons the feature toggles have been changed to represent a
disabled state. The naming has been changed accordingly. Where you'd previously
write `volume-control` you'd now write `no-volume-controls`. See the README.md
for an example.

#### More reliable reachable status

The reachable status was previously reported when the accessory has seen
MDNS announcements for the Apple TV or iTunes. This version updates the
reachable state depending upon the actual network connection state.

#### Made zero the default media type value in the NowPlayingService

This aligns the value with reports from Apple TV, when playing media from apps.
The reported media type is zero in those cases.

#### Report actual playback position via getproperty calls instead of guessing

Previous version tried to guess the playback position by essentially counting
the seconds. This version periodically acquires the actual playback position and
updates the characteristic in response to reports from iTunes or Apple TV.

#### Now Playing Service shows all characteristics immediately

If nothing was playing most of the characteristics were missing from the now
playing service as they were optional.

#### Added media skipping service

The service provides two additional controls to skip forward and backward to
the next or previous track respectively. The service is enabled by default for
all accessory and can be disabled for each accessory individually using a
feature togggle.

## Version 0.0.6 - 2017-12-10

- Implemented exponential backoff to recover broken DACP connections
- Added media type to the NowPlayingService
- Added genre to the NowPlayingService
- Emptying values in the NowPlayingService if Apple TV or iTunes disappears
- Added this change log
- Reworded pairing messages in the log
- Added decoder for 'mers' and 'merr' DMAP messages
- Setting accessory as unreachable if Apple TV or iTunes disappears

## Version 0.0.5 - 2017-12-09

- Write errors to the log when a DACP connection fails

## Version 0.0.4 - 2017-12-08

- Changed license to MIT in package
- Started basic error handling and recovery for DACP connections
- Improved parsing of DMAP message containers
- Basic error handling in DacpClient
- Improved messages in homebridge logs for pairing purposes

## Version 0.0.3 - 2017-12-08

- No changes

## Version 0.0.2 - 2017-12-08

- Added Play/Pause switch to control playback

## Version 0.0.1 - 2017-12-08

- Created initial basic accessory and initial work on DMAP support.