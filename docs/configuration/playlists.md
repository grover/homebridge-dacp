# Playlist support

This plugin can initiate the playback of playlists in iTunes. This feature is not supported for Apple TV.

To configure playlists, you must follow the following steps:

1. Create the playlist in iTunes
2. Configure the playlist
3. Restart homebridge

## Configure a playlist

Assuming you have a regular iTunes configuration as shown in the [iTunes example](../../examples/itunes) you can add playlists in the following manner:

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
          "name": "iTunes",
          "playlists": [
            "Test"
          ]
        }
      ]
    }
  ]
}
```

In the example one playlist is added, which is named `Test`.

# Using the playlist feature

Once playlists have been added and homebridge has been restarted, you can launch any playlist by toggling the button in your HomeKit enabled app. This does not work in Apple Home.