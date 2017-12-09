# Homebridge DACP Plugin

_This is still work in progress._

This plugin enables Homebridge to control devices or programs, which implement [DACP](https://en.wikipedia.org/wiki/Digital_Audio_Control_Protocol). Examples of programs or
devices that can be controlled by this plugin are Apple TV and iTunes.

This plugin runs on any system capable of running [Homebridge](https://github.com/nfarina/homebridge)
and only needs network access to the device or program in question. There is no need to
run this on the same machine as iTunes.

This plugin provides volume control and play/pause controls via HomeKit. These can be
used in conjunction with the [homebridge-callmonitor plugin](https://github.com/grover/homebridge-callmonitor)
to pause media playback or to reduce the playback volume while on a phone call.

The Speaker service, which provides volume control and mute, can be disabled if it is not
required - for example if the Apple TV is connected to an A/V receiver that is integrated with HomeKit via a different plugin.

## Installation instructions

After [Homebridge](https://github.com/nfarina/homebridge) has been installed:

 ```sudo npm install -g homebridge-dacp```

## Example config.json

```json
{
  "bridge": {
      ...
  },
  "platforms": [
    {
      "platform": "DACP",
      "devices": [
        {
          "name": "Apple TV (Living room)",
          "pairing": "...pairing code...",
          "serviceName": "...service name...",
        },
        {
          "name": "iTunes on iMac",
          "pairing": "...pairing code...",
          "serviceName": "...service name..."
        }
      ]
    }
  ]
}
```

The platform can connect to any number of devices or programs at the same time as long as they support the DACP protocol. I've tested the plugin with an Apple TV 4 and iTunes 12.7.

You may choose to create all accessories with one remote or create multiple remotes and group your
accessories in a way that suits you best.

The plugin is configured with the following configuration:

| Attributes | Usage |
|------------|-------|
| name | The name of the accessory and remote control to create for this device. |
| pairing | The pairing code for the device, which is created during the pairing process. |
| serviceName | The service name obtained during the pairing process. |
| features | An object that enables you to restrict the services created for this accessory. |
| no-volume-control | Disables the Speaker service for Apple TVs, which perform volume control through external devices like a TV or A/V receiver. |

## Accessory Services

Each device will expose multiple services:

* Accessory Information Service
* Speaker Service
* [Player Controls Service](src/hap/PlayerControlsTypes.js)
* [Now Playing Service](src/hap/NowPlayingTypes.js)

### Player Controls Service

This service provides status information about the currently playing media. This contains
the following fields:

| Characteristic | UUID | Type | Permissions | Description |
|----------------|------|------|-------------|-------------|
| PlayPause | `BA16B86C-DC86-482A-A70C-CC9C924DB842` | Boolean | Read, Write, Notify | Represents the playback state of the device/iTunes. |


### Now Playing Service

This service provides status information about the currently playing media. This contains
the following fields:

| Characteristic | UUID | Type | Permissions | Description |
|----------------|------|------|-------------|-------------|
| Title | `00003001-0000-1000-8000-135D67EC4377` | String | Read, Notify | The title of the currently playing track. |
| Album | `00003002-0000-1000-8000-135D67EC4377` | String | Read, Notify | The album of the currently playing track. |
| Artist | `00003003-0000-1000-8000-135D67EC4377` | String | Read, Notify | The artist of the currently playing track. |
| Position | `00002007-0000-1000-8000-135D67EC4377` | String | Read, Notify | The current playback position. |
| Duration | `00003005-0000-1000-8000-135D67EC4377` | String | Read, Notify | The duration of the current track. |

## Supported clients

This platform and the devices it controls have been verified to work with the following apps on iOS 11

* Elgato Eve

## Supported devices and programs

* Apple TV 4
* Apple iTunes 12.7

Other devices not listed here may work. If you have another device that works, please report
it via a [GitHub](https://github.com/grover/homebridge-dacp/issues) issue.

### Pairing

The remote control created by this plugin needs to be paired to the devices you want to use. The pairing process varies by device or program
and the following screenshots illustrate the pairing process.

#### Pairing Apple TV to a homebridge-dacp remote control

_TODO_

#### Pairing Apple iTunes to a homebridge-dacp remote control

_TODO_

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
