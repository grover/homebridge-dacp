# Media Skipping Service

Service ID: `5F862E4E-9D42-4636-9F1E-0D4BC5572705`

This service simulates the remote control buttons for the device. This contains
the following fields:

| Characteristic | UUID | Type | Permissions | Description |
|----------------|------|------|-------------|-------------|
| TopMenuButton | `53426A9B-1AB0-44CB-B88B-82D96EFC51CE` | Boolean | Read, Write, Notify | Simulates a press of the Top Menu button on an AppleTV remote. |
| MenuButton | `CB68261D-DB68-46B8-B1F0-5BDFEC872039` | Boolean | Read, Write, Notify | Simulates a press of the Menu button on an AppleTV remote. |
| SelectButton | `C67044BB-EE9F-4F72-9816-FEE962BE1EB1` | Boolean | Read, Write, Notify | Simulates a press of the Select button on an AppleTV remote. |
| UpButton | `3B005F2F-E2AE-4895-A37E-53280E2EA764` | Boolean | Read, Write, Notify | Simulates a press of the Up button on an AppleTV remote. |
| DownButton | `B17E1EC9-314B-46F1-97D5-0A371B662D2A` | Boolean | Read, Write, Notify | Simulates a press of the Down button on an AppleTV remote. |
| LeftButton | `76261837-BFE3-413B-9803-36122EE1D994` | Boolean | Read, Write, Notify | Simulates a press of the Left button on an AppleTV remote. |
| RightButton | `A3DECC2A-4852-4347-A548-9972E0490891` | Boolean | Read, Write, Notify | Simulates a press of the Right button on an AppleTV remote. |

Source code: [InputControlTypes.js](src/hap/InputControlTypes.js)

