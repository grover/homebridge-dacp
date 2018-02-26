# Artwork Support

**Works on Apple TV and iTunes**

This plugin is able to stream the artwork of the currently playing media item via a seperate camera feed. This works in the Home app.

## Installation

1. In order to enable the artwork support you must have an ffmpeg installed on the local system.
2. Stop homebridge if it is running
3. Enable the artwork feature for a DACP server
4. Run homebridge
5. Pair the newly created camera device with HomeKit

## Configuration

An appropriate configuration in step 3 looks as follows:

```json
    {
      "platform": "DACP",
      "devices": [
        {
          "name": "iTunes",
          "features": {
            "album-artwork": "/tmp/nowplaying.png"
          }
        }
      ]
    }
```

(There's several other settings and features left out of the above JSON snippet.)

The `album-artwork` feature points to a file path, which will hold temporary images of the currently playing artwork. This file may not exist 
on the system and it is recommended to store it in a temporary location, best backed by a memory file system.

There's no further configuration need. The plugin will pick up the omx video codec if running on a Raspberry Pi and use x264 on all other platforms.