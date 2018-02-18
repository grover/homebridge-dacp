# Playlist Control Service

Service ID: `24B5B813-8D9C-49C3-ABFB-EDE879A4FF99`

This service provides a start control for the each configured playlist. The
the following fields:

| Characteristic | UUID | Type | Permissions | Description |
|----------------|------|------|-------------|-------------|
| StartPlaylist | dynamic | Boolean | Read, Write, Notify | A toggle control to start playback of a specific playlist. |

Source Code: [PlaylistTypes.js](src/hap/PlaylistTypes.js)