# HomeKit Applications

This plugin has been tested on iOS 11 with the following HomeKit apps:

* Apple's Home app
* Elgato Eve

Apple's Home app does not support custom services/characteristics extensions - as such not all functionality is available there. You can still use the Home app with limitations and use other apps to set up the rules and scenes for you.

Other apps might work, but I can't test them all. If you're using an app that's not listed write me an [issue](https://www.github.com/grover/homebridge-dacp/issues) to update the documentation accordingly.

# Home App limitations

The home app will not support the following features:

* Now Playing information
* Track skipping
* Playlists

The play/pause functionality can be changed to act as a regular switch using the [features](configuration/features.md), which at least enables some functionality.
