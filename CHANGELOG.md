
# Changelog

## TODO

- Switch to dynamic platform/accessories
- Setting accessory as unreachable if Apple TV or iTunes disappears

## Work in progress - Version 0.0.6 - 2017-12-10

- Implemented exponential backoff to recover broken DACP connections
- Added media type to the NowPlayingService
- Added genre to the NowPlayingService
- Emptying values in the NowPlayingService if Apple TV or iTunes disappears
- Added this change log
- Reworded pairing messages in the log
- Added decoder for 'mers' and 'merr' DMAP messages

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