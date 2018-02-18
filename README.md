# Homebridge DACP

This platform plugin enables Homebridge to control devices or programs, which implement [DACP](https://en.wikipedia.org/wiki/Digital_Audio_Control_Protocol). Examples of programs or
devices that can be controlled by this plugin are Apple TV and iTunes.

Any system capable of running [Homebridge](https://github.com/nfarina/homebridge) can be
used to run `homebridge-dacp`. The only need is network access to the device or program in
question. There is no need to run this on the same machine as iTunes to expose it via HomeKit.

homebridge-dacp provides volume control and play/pause controls via HomeKit. These can be
used in conjunction with the [homebridge-callmonitor plugin](https://github.com/grover/homebridge-callmonitor)
to pause media playback or to reduce the playback volume while on a phone call.

The Speaker service, which provides volume control and mute, can be disabled if it is not
required - for example if the Apple TV is connected to an A/V receiver that is integrated
with HomeKit via a different plugin.

## Status

[![HitCount](http://hits.dwyl.io/grover/homebridge-dacp.svg)](https://github.com/grover/homebridge-dacp)
[![Build Status](https://travis-ci.org/grover/homebridge-dacp.png?branch=master)](https://travis-ci.org/grover/homebridge-dacp)
[![Node version](https://img.shields.io/node/v/homebridge-dacp.svg?style=flat)](http://nodejs.org/download/)
[![NPM Version](https://badge.fury.io/js/homebridge-dacp.svg?style=flat)](https://npmjs.org/package/homebridge-dacp)

## Changelog

See the [changelog](CHANGELOG.md) for changes between versions of this package.

## Documentation

* [Supported HomeKit Apps](docs/apps.md)
* [Supported DACP servers](docs/servers.md)
* [Installation instruction](docs/install.md)
  * [Configuring Apple TV](docs/configuration/appletv.md)
  * [Configuring iTunes](docs/configuration/itunes.md)
  * [Feature Toggles](docs/configuration/features.md)
  * [Configuring Playlists](docs/configuration/playlists.md)
* Custom Services and Characteristics
  * [Media Skipping Service](docs/services/mediaskippingservice.md)
  * [Now Playing Service](docs/services/nowplayingservice.md)
  * [Player Controls Service](docs/services/playercontrolsservice.md)
  * [Playlist Control Service](docs/services/playlistcontrolservice.md)
* Examples
  * [Basic installation](examples/install)
  * [Apple TV configuration](examples/appletv)
  * [iTunes configuration](examples/itunes)
  * [Features](examples/features)
  * [Playlists](examples/playlists)
  * [Multiple remotes for multiple apps/devices](examples/multiple-remotes)

## Some asks for friendly gestures

If you use this and like it - please leave a note by staring this package here or on GitHub.

If you use it and have a problem, file an issue at [GitHub](https://github.com/grover/homebridge-dacp/issues) - I'll try to help.

If you tried this, but don't like it: tell me about it in an issue too. I'll try my best
to address these in my spare time.

If you fork this, go ahead - I'll accept pull requests for enhancements.

## License

MIT License

Copyright (c) 2017 Michael Fröhlich

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
