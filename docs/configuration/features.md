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

## Input Control

This plugin provides a virtual representation of the typical remote control buttons through the input control service. This feature toggle
enables the input controls in a mode that's not useable in Apple Home.

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
          "name": "Input-Controls Example",
          "features": {
            "input-controls": true
          }
        }
      ]
    }
  ]
}
```

## Alternate Input Controls

The alternate input controls provide a similar experience as the input control feature above, but with many independent switches. This feature toggle is either a boolean or a list of buttons to provide to HomeKit:

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
          "name": "Alternate-Input-Controls Example",
          "features": {
            "alternate-input-controls": true
          }
        }
      ]
    }
  ]
}
```

If set to `true`, this enables all buttons as in the `input-controls` above as independented switches. The following example restricts that
to only provide the Menu and TopMenu buttons:

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
          "name": "Alternate-Input-Controls Example",
          "features": {
            "alternate-input-controls": ["menu", "topmenu"]
          }
        }
      ]
    }
  ]
}
```

The following buttons can be listed in the `alternate-input-controls`:

* menu
* topmenu
* select
* up
* down
* left
* right

## Album Artwork

Points to the temporary file path used to capture the artwork of the currently playing media file. See [Artwork Support](artwork.md) for more.

## Using multiple feature toggles

You can use multiple feature toggles at the same time. The [features](../../examples/features) example shows a full configuration of the DACP plugin with multiple features ready for your use.
