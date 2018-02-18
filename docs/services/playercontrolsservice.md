# Player Controls Service

Service ID: `EFD51587-6F54-4093-9E8D-FA3975DCDCE6`

This service provides a play/pause control for the device. This contains
the following fields:

| Characteristic | UUID | Type | Permissions | Description |
|----------------|------|------|-------------|-------------|
| PlayPause | `BA16B86C-DC86-482A-A70C-CC9C924DB842` | Boolean | Read, Write, Notify | Represents the playback state of the device/iTunes. |

Source Code: [PlayerControlsTypes.js](src/hap/PlayerControlsTypes.js)
