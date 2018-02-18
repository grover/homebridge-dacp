# Using homebridge-dacp with iTunes

iTunes provides an extensive implementation of the DACP protocol. This plugin only uses a subset of the protocol:

* Volume controls
* Play/Pause controls
* Now playing information
* Track skipping
* [Playlist support](playlists.md)

## Configuration

The following configuration is recommended for Apple TV:

```json
{
  "name": "iTunes"
}
```

See also the [iTunes example configuration](../../examples/itunes/config.json) for a full example.

### Features

Some [features](features.md) might be of interest to you in addition to the basic configuration. Additionally you can configure [playlists](playlists.md) - which helps you trigger playlists in response to certain scenes.

## Pairing

With the above configuration you've created a virtual remote control called `iTunes` for your iTunes. The next step is to pair iTunes with the remote. Apple has provided [support documentation](https://support.apple.com/kb/ph19503) on the pairing process. Follow the process and the following instructions on this page to complete the pairing process.

### Pairing code

When you launch `homebridge` with this configuration, a log similar to the following will be displayed:

```text
[DACP] Found accessory in config: "iTunes"
[DACP]
[DACP] Skipping creation of the accessory "iTunes" because it doesn't have a pairing code or
[DACP] service name yet. You need to pair the device/iTunes, reconfigure and restart homebridge.
[DACP]
[DACP] Beginning remote control announcements for the accessory "iTunes remote".
[DACP]
[DACP] 	Use passcode 7118 to pair with this remote control.
[DACP]
```

The plugin is advertising the new remote control for pairing and can be paired using the passcode printed.

Enter the pairing code 7118 in iTunes.

## Complete the pairing

After you've entered the pairing code in iTunes you'll see lines like the following in your homebridge log.

```text
[DACP] Completed pairing for "iTunes":
[DACP] 
[DACP] {
[DACP]   "name": "iTunes remote",
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

**Note**: The pairing and service name codes will differ for each iTunes. Do not copy the above values, use those printed in your homebridge log.

Insert the `pairing` and `serviceName` fields in your ```config.json``` and restart homebridge to enable the remote control.

You can repeat the process for all your computers and devices. It is recommended that you set up your remotes one by one.
