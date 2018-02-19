# Features

Features provide the capability to control if specific characteristics will show up for a device. All features are boolean true/false switches and described below:

## Alternate Play/Pause Switch

By default this plugin is not compatible with Apple Home. In order to at least enable basic play/pause functionality, you need to enable the `alternate-playpause-switch` feature.

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
          "name": "Alternate Play/Pause Example",
          "features": {
            "alternate-playpause-switch": true
          }
        }
      ]
    }
  ]
}
```

## No Volume Controls

In most cases your AppleTV will not control the volume of played media, but your TV or AVR will. This is also true if the Remote has working volume control buttons as the volume up/down commands are sent either directly to the TV/AVR through infrared signals or as commands through the HDMI cable. Thus the plugin can't really control the volume of your TV/AVR.

To disable the volume controls, enable the `no-volume-control` feature.

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
          "name": "No-Volume-Control Example",
          "features": {
            "no-volume-control": true
          }
        }
      ]
    }
  ]
}
```

## No Skip Controls

If you don't want to see track skipping controls, you can disable them with the `no-skip-controls` feature.

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
          "name": "No-Skip-Controls Example",
          "features": {
            "no-skip-controls": true
          }
        }
      ]
    }
  ]
}
```

## Use-Referer

If you're runnning homebridge-dacp in an docker-homebridge environment, the MDNS lookups will likely fail in some
situations. This was well documented in [Issue #10](https://github.com/grover/homebridge-dacp/issues/10). To remedy the
situation you need to enable the use of the referer address instead of hostname lookups:

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
          "name": "Use Referer Example",
          "features": {
            "use-referer": true
          }
        }
      ]
    }
  ]
}
```

## Using multiple feature toggles

You can use multiple feature toggles at the same time. The [features](../../examples/features) example shows a full configuration of the DACP plugin with multiple features ready for your use.