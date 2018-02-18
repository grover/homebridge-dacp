# Media Skipping Service

Service ID: `07163D16-8F0E-4B36-9AC4-18BE183B9EDE`

This service provides skip forward/backward controls for the device. This contains
the following fields:

| Characteristic | UUID | Type | Permissions | Description |
|----------------|------|------|-------------|-------------|
| SkipForward | `CD56B40B-F98B-4ACA-BF5E-4AD4E9C77D1C` | Boolean | Read, Write, Notify | Skips forward to the next track. Automatically resets to false after the skip operation has completed. |
| SkipBackward | `CFFE477D-70C8-4630-B33B-25073F137191` | Boolean | Read, Write, Notify | Skips backward to the previous track. Automatically resets to false after the skip operation has completed. |

Source code: [MediaSkippingTypes.js](src/hap/MediaSkippingTypes.js)

