# Using homebridge-dacp with Apple TV

Your Apple TV devices speak the DACP protocol, albeit with some differences to a regular iTunes. For example [playlists](playlists.md) are not supported on Apple TVs as they do not expose the database required to search, queue and play back media.

If you're curious as to the differences between iTunes and Apple TV: Take a look at the Apple Remote app on the Appstore. The capabilities of the app are to a certain extent also available to this plugin.

## What you can do

On Apple TV the following functionality is available:

* Play/Pause
* Now playing information (Unfortunately not all apps provide this)

Even with these constraints this enables you to set up rules that control the Apple TV to pause media playback in a scene and resume it later.

## Configuration

The following configuration is recommended for Apple TV:

```json
{
  "name": "AppleTV",
  "features": {
    "no-volume-controls": true
  }
}
```

See also the [AppleTV example configuration](../../examples/appletv/config.json) for a full example.

### Features

You may want to play around with `no-volume-controls` as this depends on your home theater set up. The documentation for this and others can be found on the [features page](features.md).

## Pairing

With the above configuration you've created a virtual remote control called `AppleTV` for your Apple TV. The next step is to pair the Apple TV with the remote. On your Apple TV:

* Open the settings app
* Navigate to 
* Choose 
* Select your newly created remote (`AppleTV` above)
* When asked enter the pairing code of the remote control (see below)

### Pairing code

When you launch `homebridge` with this configuration, a log similar to the following will be displayed:

```text
[DACP] Found accessory in config: "AppleTV"
[DACP]
[DACP] Skipping creation of the accessory "AppleTV" because it doesn't have a pairing code or
[DACP] service name yet. You need to pair the device/iTunes, reconfigure and restart homebridge.
[DACP]
[DACP] Beginning remote control announcements for the accessory "AppleTV".
[DACP]
[DACP] 	Use passcode 7118 to pair with this remote control.
[DACP]
```

The plugin is advertising the new remote control for pairing and can be paired using the passcode printed.

Enter the pairing code 7118 on your Apple TV.

## Complete the pairing

After you've entered the pairing code on your Apple TV you'll see lines like the following in your homebridge log.

```text
[DACP] Completed pairing for "AppleTV":
[DACP] 
[DACP] {
[DACP]   "name": "AppleTV",
[DACP]   "pairing": "16BC60A46299FEC4",
[DACP]   "serviceName": "AEA342CEA7A8E7EE"
[DACP] }
[DACP] 
[DACP] Please add the above block to the accessory in your homebridge config.json.
[DACP]
[DACP] YOU MUST RESTART HOMEBRIDGE AFTER YOU ADDED THE ABOVE LINES OR THE ACCESSORY
[DACP] WILL NOT WORK.
[DACP]
```

Insert the `pairing` and `serviceName` fields in your ```config.json``` and restart homebridge to enable the remote control.

You can repeat the process for all your devices. It is recommended that you set up your remotes one by one.
