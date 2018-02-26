# Macros support

**AppleTV only**

This plugin can initiate a sequence of key presses to trigger specific actions on the Apple TV. The macro language is comprised of all the keys on
the remote control and they are executed in sequence.

## Configure a macro

Assuming you have a regular Apple TV configuration as shown in the [Apple TV example](../../examples/appletv) you can add macros in the following manner:

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
          "name": "AppleTV",
          "macros": {
            "Settings": [
              'topmenu', 
              'left', 
              'left', 
              'left', 
              'left', 
              'up', 
              'up', 
              'up', 
              'up', 
              'up', 
              'up', 
              'down', 
              'down', 
              'down', 
              'down', 
              'down',
              'select'
            ]
          }
        }
      ]
    }
  ]
}
```

In the example one macro is added, which is named `Settings`.

## Using the macro feature

Once macros have been added and homebridge has been restarted, you can launch any macro by toggling the button in your HomeKit enabled app. This does not work in Apple Home.

The plugin will execute the macro in sequence.

## Supported macro commands

The following commands (keys) are currently supported in a macro:

| Command | Action |
|---|---|
| topmenu | Simulates the press of the Top Menu key on the remote. |
| menu | Simulates the press of the Menu key on the remote. |
| select | Simulates the press of the selection key on the remote. |
| up | Simulates an upward stroke or the press of the up button on the remote. |
| down | Simulates a downward stroke or the press of the down button on the remote. |
| left | Simulates a leftward stroke or the press of the left button on the remote. |
| right | Simulates a rightward stroke or the press of the right button on the remote. |
| wait5s | Waits for five seconds before executing the next command in the sequence. |

