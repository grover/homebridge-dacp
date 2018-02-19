# Installation instructions

If you haven't done so: install [homebridge](https://github.com/nfarina/homebridge) per the official [installation instructions](https://github.com/nfarina/homebridge#installation).

After you've installed homebridge go ahead and install the plugin with:

```bash
npm install -g homebridge-dacp --unsafe-perm
```

You might need ```sudo``` privileges to install into the global node_modules.

## Basic configuration

To use the plugin, add the following basic configuration to your `config.json` that configures homebridge in the ```platforms``` section:

```json
{
  "platform": "DACP",
  "devices": [
  ]
}
```

After you've saved your `config.json` you can go ahead and launch homebridge and observe the logs.

## Running in Alpine Linux or a Docker environment?

You're likely going to face MDNS and name lookup problems. To circumvent those it is recommended that you enable the
[use-referer feature](configuration/features.md#Use-Referer).

## First run

With the above configuration homebridge and homebridge-dacp will print the following logs:

```text
Loading 1 platforms...
[DACP] Initializing DACP platform...
[DACP] DACP Platform Plugin Loaded - Version 0.7.6
[DACP] Starting DACP browser...
```

This shows that you've installed homebridge and homebridge-dacp correctly.

You can go ahead and pair your [Apple TV](configuration/appletv.md) or [iTunes](configuration/itunes.md).