# Now Playing Service

Service ID: `F7138C87-EABF-420A-BFF0-76FC04DD81CD`

This service provides status information about the currently playing media. This contains
the following fields:

| Characteristic | UUID | Type | Permissions | Description |
|----------------|------|------|-------------|-------------|
| Title | `00003001-0000-1000-8000-135D67EC4377` | String | Read, Notify | The title of the currently playing track. |
| Album | `00003002-0000-1000-8000-135D67EC4377` | String | Read, Notify | The album of the currently playing track. |
| Artist | `00003003-0000-1000-8000-135D67EC4377` | String | Read, Notify | The artist of the currently playing track. |
| Genre | `8087750B-8B8C-451E-B907-8E3BAD8DCB1E` | String | Read, Notify | The genre of the currently playing track. |
| Media Type | `9898982C-7B70-47AD-A81D-211BFE5AFBF2` | Number | Read, Notify | The media type of the currently playing track. See [Media Types](doc/MediaTypes.md) for more. |
| Position | `00002007-0000-1000-8000-135D67EC4377` | String | Read, Notify | The current playback position. |
| Duration | `00003005-0000-1000-8000-135D67EC4377` | String | Read, Notify | The duration of the current track. |

Source Code: [NowPlayingTypes.js](src/hap/NowPlayingTypes.js)