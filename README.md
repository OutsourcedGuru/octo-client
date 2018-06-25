# octo-client
A Node module for remotely accessing an OctoPrint instance

> **Node.js** is an open-source, cross-platform JavaScript run-time environment that executes JavaScript code server-side.
>
> **OctoPrint** is the leading web software for controlling 3D printers, created/maintained by Gina Häußge
>
> **OctoPi** is a Raspberry-specific distro of OctoPrint, maintained by Guy Sheffer

## Overview
[OctoPrint's REST API](http://docs.octoprint.org/en/master/api/index.html) allows the printer to be queried and activities managed. This Node module is a wrapper for making those calls.

## Installation
This module is intended to be added like you would any other as found on [npmjs.com](https://www.npmjs.com).

```
cd ~/MyNodeApp
npm install --save octo-client
```

## Configuration
Next, you'll need to edit your appdir's `node_modules/octo-client/config.js` file to enter your printer's `hostName` ("octopi.local" by default) and `apiKey` (found under OctoPrint -> Settings -> API).

## Usage
Review the `examples.js` file for the various calls to the interface.

```
var OctoPrint = require('octo-client');

OctoPrint.printerState(function(response){
  console.log(response);
});
```

Assuming that the printer is up and available on your network by its hostname, running the code snippet above should display something like:

```
{ state: 
   { flags: 
      { cancelling: false,
        closedOrError: false,
        error: false,
        operational: true,
        paused: false,
        pausing: false,
        printing: false,
        ready: true,
        sdReady: false },
     text: 'Operational' },
  temperature: { tool0: { actual: 27.5, offset: 0, target: 0 } } }
```

Programmatically then, it should be possible to do more interesting things like the following...

```
var OctoPrint = require('octo-client');

OctoPrint.printerState(function(ptr){
  if (ptr.state.flags.operational) {
    var targetHotend1 = ptr.temperature.tool0.target;
    console.log(targetHotend1);
  }
});

```

## Methods

### version
OctoPrint.version(callback);

```
{ api: '0.1', server: '1.3.8' }
```

See the `printerState` documentation below for error conditions.

### connection
OctoPrint.connection(callback);

When the printer is on but not in the Connected state:

```
{ current: 
   { baudrate: null,
     port: null,
     printerProfile: '_default',
     state: 'Closed' },
  options: 
   { baudratePreference: null,
     baudrates: [ 250000, 230400, 115200, 57600, 38400, 19200, 9600 ],
     portPreference: null,
     ports: [ '/dev/ttyACM0' ],
     printerProfilePreference: '_default',
     printerProfiles: [ [Object] ] } }
```

...and when the printer is in the Connected state:

```
{ current: 
   { baudrate: 0,
     port: 'AUTO',
     printerProfile: '_default',
     state: 'Operational' },
  options: 
   { baudratePreference: null,
     baudrates: [ 250000, 230400, 115200, 57600, 38400, 19200, 9600 ],
     portPreference: null,
     ports: [ '/dev/ttyACM0' ],
     printerProfilePreference: '_default',
     printerProfiles: [ [Object] ] } }
```

See the `printerState` documentation below for error conditions.

### connect
OctoPrint.connect(callback);

```
{ status: 'Success' }
```

See the `printerState` documentation below for error conditions.

### disconnect
OctoPrint.disconnect(callback);

```
{ status: 'Success' }
```

See the `printerState` documentation below for error conditions.

### files
OctoPrint.files(bRecursive = false, callback);

A `true` value as the first argument will include all subfolders under the `local` directory which is a synonym for `uploads`. A `false` or `null` value only shows the files in that folder.

```
{ files: 
   [ { date: 1528902279,
       display: 'TC-MoldFront.gcode',
       gcodeAnalysis: [Object],
       hash: 'f5db9f02283d75fc73dc3c1b310dc3415709ff42',
       name: 'TC-MoldFront.gcode',
       origin: 'local',
       path: 'TC-MoldFront.gcode',
       prints: [Object],
       refs: [Object],
       size: 11674021,
       statistics: [Object],
       type: 'machinecode',
       typePath: [Array] },
     { date: 1528846521,
       display: 'Totoro-Lego.gcode',
       gcodeAnalysis: [Object],
       hash: '45ad15262ca44eca5d7d92dd58ca239fd27174fb',
       name: 'Totoro-Lego.gcode',
       origin: 'local',
       path: 'Totoro-Lego.gcode',
       prints: [Object],
       refs: [Object],
       size: 1986739,
       statistics: [Object],
       type: 'machinecode',
       typePath: [Array] },
     { date: 1528989933,
       display: 'TC-MoldBack.gcode',
       gcodeAnalysis: [Object],
       hash: '9c910fb3790794b67599b180f291379d2085bdae',
       name: 'TC-MoldBack.gcode',
       origin: 'local',
       path: 'TC-MoldBack.gcode',
       prints: [Object],
       refs: [Object],
       size: 9156225,
       statistics: [Object],
       type: 'machinecode',
       typePath: [Array] } ],
  free: 4231987200,
  total: 7543226368 }
```

See the `printerState` documentation below for error conditions.

### file
OctoPrint.file(path, callback);

A `filename` value as the first argument will query information about that file. A typical value might be `3DBenchy.gcode`. The path is relative to the `uploads` folder as the root; a beginning slash is unnecessary.

```
{ date: 1524088861,
  display: '3DBenchy.gcode',
  gcodeAnalysis: 
   { dimensions: 
      { depth: 15.599999999999994,
        height: 4.8,
        width: 17.59899999999999 },
     estimatedPrintTime: 305.82916377222693,
     filament: { tool0: [Object] },
     printingArea: 
      { maxX: 76.817,
        maxY: 109.166,
        maxZ: 5.1,
        minX: 59.218,
        minY: 93.566,
        minZ: 0.3 } },
  hash: '8673bbd4c298627bf74a057afbbf7f4a136ca81f',
  name: '3DBenchy.gcode',
  origin: 'local',
  path: '3DBenchy.gcode',
  prints: 
   { failure: 12,
     last: 
      { date: 1528300170.830957,
        printTime: 442.8355870246887,
        success: true },
     success: 2 },
  refs: 
   { download: 'http://octopi.local/downloads/files/local/3DBenchy.gcode',
     resource: 'http://octopi.local/api/files/local/3DBenchy.gcode' },
  size: 180153,
  statistics: 
   { averagePrintTime: { _default: 404.68370950222015 },
     lastPrintTime: { _default: 442.8355870246887 } },
  type: 'machinecode',
  typePath: [ 'machinecode', 'gcode' ] }
```

See the `printerState` documentation below for error conditions.

### selectFile
OctoPrint.file(path, bPrint, callback);

A `filename` value as the first argument will select that file. A typical value might be `3DBenchy.gcode`. The path is relative to the `uploads` folder as the root; a beginning slash is unnecessary.

The second argument as `true` will start the print. A value of `false` does not automatically start the print.

```
{ status: 'Success' }
```

See the `printerState` documentation below for error conditions.

### job
OctoPrint.job(callback);

```
{ job: 
   { averagePrintTime: null,
     estimatedPrintTime: null,
     filament: null,
     file: 
      { date: null,
        display: null,
        name: null,
        origin: null,
        path: null,
        size: null },
     lastPrintTime: null },
  progress: 
   { completion: null,
     filepos: null,
     printTime: null,
     printTimeLeft: null,
     printTimeLeftOrigin: null },
  state: 'Operational' }
```

See the `printerState` documentation below for error conditions.

### jobStart
OctoPrint.jobStart(callback);

```
{ status: 'Success' }
```

See the `printerState` documentation below for error conditions.

### jobCancel
OctoPrint.jobCancel(callback);

```
{ status: 'Success' }
```

See the `printerState` documentation below for error conditions.

### jobPause
OctoPrint.jobPause(callback);

```
{ status: 'Success' }
```

See the `printerState` documentation below for error conditions.

### jobResume
OctoPrint.jobResume(callback);

```
{ status: 'Success' }
```

See the `printerState` documentation below for error conditions.

### languages
OctoPrint.languages(callback);

```
{ language_packs: 
   { _core: { display: 'Core', identifier: '_core', languages: [] } } }
```

See the `printerState` documentation below for error conditions.

### setings
OctoPrint.settings(callback);

```
{ api: 
   { allowCrossOrigin: false,
     enabled: true,
     key: 'REDACTED' },
  appearance: 
   { color: 'default',
     colorTransparent: false,
     defaultLanguage: '_default',
     name: 'OctoPi',
     showFahrenheitAlso: false },
  feature: 
   { autoUppercaseBlacklist: [ 'M117' ],
     g90InfluencesExtruder: false,
     gcodeViewer: true,
     keyboardControl: true,
     legacyPluginAssets: false,
     mobileSizeThreshold: 2097152,
     modelSizeDetection: true,
     pollWatched: false,
     printCancelConfirmation: true,
     sdSupport: false,
     sizeThreshold: 20971520,
     temperatureGraph: true },
  folder: 
   { logs: '/home/pi/.octoprint/logs',
     timelapse: '/home/pi/.octoprint/timelapse',
     timelapseTmp: '/home/pi/.octoprint/timelapse/tmp',
     uploads: '/home/pi/.octoprint/uploads',
     watched: '/home/pi/.octoprint/watched' },
  plugins: 
   { announcements: 
      { channel_order: [Array],
        channels: [Object],
        display_limit: 3,
        enabled_channels: [Array],
        forced_channels: [Array],
        summary_limit: 300,
        ttl: 360 },
     bedlevelvisualizer: 
      { command: 'G29 T1',
        flipX: false,
        flipY: false,
        mesh_timestamp: '5/2/2018, 2:48:24 PM',
        save_mesh: true,
        stored_mesh: [Array],
        stored_mesh_x: [Array],
        stored_mesh_y: [Array],
        stored_mesh_z_height: 145,
        stripFirst: false },
     cura: 
      { cura_engine: '/usr/local/bin/cura_engine',
        debug_logging: false,
        default_profile: null },
     discovery: 
      { httpPassword: null,
        httpUsername: null,
        model: [Object],
        pathPrefix: null,
        publicHost: null,
        publicPort: 80,
        upnpUuid: 'REDACTED',
        zeroConf: [] },
     gcodesystemcommands: { command_definitions: [Array] },
     navbartemp: { displayRaspiTemp: true },
     pluginmanager: 
      { dependency_links: false,
        hidden: [],
        notices: 'https://plugins.octoprint.org/notices.json',
        notices_ttl: 360,
        pip_args: null,
        pip_force_user: false,
        repository: 'https://plugins.octoprint.org/plugins.json',
        repository_ttl: 1440 },
     softwareupdate: 
      { cache_ttl: 1440,
        notify_users: true,
        octoprint_branch_mappings: [Array],
        octoprint_checkout_folder: '/home/pi/OctoPrint',
        octoprint_method: 'pip',
        octoprint_release_channel: 'master',
        octoprint_type: 'github_release',
        pip_command: null },
     themeify: 
      { color: [Array],
        customRules: [Array],
        enableCustomization: true,
        enabled: true,
        tabs: [Object],
        theme: 'discorded' } },
  printer: { defaultExtrusionLength: 5 },
  scripts: 
   { gcode: 
      { afterPrintCancelled: 'G92 E1\nG1 E-1 F300\nG28 Z\nG28 X Y\n; disable motors\nM84\n;disable all heaters\n{% snippet \'disable_hotends\' %}\n{% snippet \'disable_bed\' %}\n;disable fan\nM106 S0',
        afterPrintDone: 'G92 E1\nG1 E-1 F300\nG28 X Y Z\nM104 S0\nM140 S0\nM84\nOCTO801',
        afterPrintPaused: 'M117 Print Paused\nG91 Z\nG1 Z15\nG90 Z',
        beforePrintResumed: 'M117 Print Resumed\nG91 Z\nG1 Z-15\nG90 Z',
        beforePrintStarted: 'OCTO801\nG91\nG28 X0 Y0 Z0\nG90\nG92 E0\nG29\n',
        'snippets/disable_bed': '{% if printer_profile.heatedBed %}M140 S0\n{% endif %}',
        'snippets/disable_hotends': '{% for tool in range(printer_profile.extruder.count) %}M104 T{{ tool }} S0\n{% endfor %}' } },
  serial: 
   { additionalBaudrates: [],
     additionalPorts: [],
     alwaysSendChecksum: false,
     autoconnect: true,
     baudrate: null,
     baudrateOptions: [ 115200, 250000, 230400, 57600, 38400, 19200, 9600 ],
     blockWhileDwelling: false,
     capAutoreportSdStatus: true,
     capAutoreportTemp: true,
     capBusyProtocol: true,
     checksumRequiringCommands: [ 'M110' ],
     disconnectOnErrors: true,
     externalHeatupDetection: true,
     firmwareDetection: true,
     helloCommand: 'M110 N0',
     ignoreErrorsFromFirmware: false,
     ignoreIdenticalResends: false,
     log: false,
     logPositionOnCancel: true,
     logPositionOnPause: true,
     longRunningCommands: [ 'G4', 'G28', 'G29', 'G30', 'G32', 'M400', 'M226', 'M600' ],
     maxTimeoutsIdle: 2,
     maxTimeoutsLong: 5,
     maxTimeoutsPrinting: 5,
     neverSendChecksum: false,
     port: null,
     portOptions: [ '/dev/ttyACM0' ],
     repetierTargetTemp: false,
     sdAlwaysAvailable: false,
     sdRelativePath: false,
     supportResendsWithoutOk: 'detect',
     swallowOkAfterResend: true,
     timeoutCommunication: 30,
     timeoutCommunicationBusy: 3,
     timeoutConnection: 10,
     timeoutDetection: 0.5,
     timeoutSdStatus: 1,
     timeoutSdStatusAutoreport: 1,
     timeoutTemperature: 5,
     timeoutTemperatureAutoreport: 2,
     timeoutTemperatureTargetSet: 2,
     triggerOkForM29: true,
     waitForStart: false },
  server: 
   { commands: 
      { serverRestartCommand: 'sudo service octoprint restart',
        systemRestartCommand: 'sudo shutdown -r now',
        systemShutdownCommand: 'sudo shutdown -h now' },
     diskspace: { critical: 209715200, warning: 524288000 },
     onlineCheck: { enabled: false, host: '8.8.8.8', interval: 15, port: 53 },
     pluginBlacklist: 
      { enabled: true,
        ttl: 15,
        url: 'https://plugins.octoprint.org/blacklist.json' } },
  system: { actions: [], events: null },
  temperature: 
   { cutoff: 30,
     profiles: [ [Object], [Object], [Object] ],
     sendAutomatically: false,
     sendAutomaticallyAfter: 1 },
  terminalFilters: 
   [ { name: 'Suppress temperature messages',
       regex: '(Send: (N\\d+\\s+)?M105)|(Recv:\\s+(ok\\s+)?(B|T\\d*):)' },
     { name: 'Suppress SD status messages',
       regex: '(Send: (N\\d+\\s+)?M27)|(Recv: SD printing byte)|(Recv: Not SD printing)' },
     { name: 'Suppress wait responses', regex: 'Recv: wait' } ],
  webcam: 
   { bitrate: '5000k',
     ffmpegPath: '/usr/bin/avconv',
     ffmpegThreads: 1,
     flipH: false,
     flipV: false,
     rotate90: false,
     snapshotSslValidation: true,
     snapshotTimeout: 5,
     snapshotUrl: 'http://127.0.0.1:8080/?action=snapshot',
     streamRatio: '16:9',
     streamTimeout: 5,
     streamUrl: '/webcam/?action=stream',
     watermark: false } }
```

See the `printerState` documentation below for error conditions.

### systemCommands
OctoPrint.systemCommands(bCustom, callback);

A `true` value as the first argument will include only the **custom** system commands. A `false` or `null` value shows both **core** and **custom**.

```
{ core: 
   [ { action: 'shutdown',
       confirm: '<strong>You are about to shutdown the system.</strong></p><p>This action may disrupt any ongoing print jobs (depending on your printer\'s controller and general setup that might also apply to prints run directly from your printer\'s internal storage).',
       name: 'Shutdown system',
       resource: 'http://octopi.local/api/system/commands/core/shutdown',
       source: 'core' },
     { action: 'reboot',
       confirm: '<strong>You are about to reboot the system.</strong></p><p>This action may disrupt any ongoing print jobs (depending on your printer\'s controller and general setup that might also apply to prints run directly from your printer\'s internal storage).',
       name: 'Reboot system',
       resource: 'http://octopi.local/api/system/commands/core/reboot',
       source: 'core' },
     { action: 'restart',
       confirm: '<strong>You are about to restart the OctoPrint server.</strong></p><p>This action may disrupt any ongoing print jobs (depending on your printer\'s controller and general setup that might also apply to prints run directly from your printer\'s internal storage).',
       name: 'Restart OctoPrint',
       resource: 'http://octopi.local/api/system/commands/core/restart',
       source: 'core' },
     { action: 'restart_safe',
       confirm: '<strong>You are about to restart the OctoPrint server in safe mode.</strong></p><p>This action may disrupt any ongoing print jobs (depending on your printer\'s controller and general setup that might also apply to prints run directly from your printer\'s internal storage).',
       name: 'Restart OctoPrint in safe mode',
       resource: 'http://octopi.local/api/system/commands/core/restart_safe',
       source: 'core' } ],
  custom: [] }
```

See the `printerState` documentation below for error conditions.

### systemReboot
OctoPrint.systemReboot(callback);

```
{ status: 'Success' }
```

See the `printerState` documentation below for error conditions.

### systemRestart
OctoPrint.systemRestart(callback);

```
{ status: 'Success' }
```

See the `printerState` documentation below for error conditions.

### systemShutdown
OctoPrint.systemShutdown(callback);

```
{ status: 'Success' }
```

See the `printerState` documentation below for error conditions.

### timelapse
OctoPrint.timelapse(callback);

```
{ config: { type: 'off' },
  files: 
   [ { bytes: 495616,
       date: '2018-05-03 10:26',
       name: '3DBenchy_20180503102406.mpg',
       size: '484.0KB',
       url: '/downloads/timelapse/3DBenchy_20180503102406.mpg' },
     { bytes: 21891072,
       date: '2018-05-01 14:43',
       name: '3DBenchy_20180501113430.mpg',
       size: '20.9MB',
       url: '/downloads/timelapse/3DBenchy_20180501113430.mpg' } ] }
```

See the `printerState` documentation below for error conditions.

### printerProfiles
OctoPrint.printerProfiles(callback);

```
{ profiles: 
   { _default: 
      { axes: [Object],
        color: 'default',
        current: true,
        default: true,
        extruder: [Object],
        heatedBed: false,
        id: '_default',
        model: 'Model Name',
        name: 'octopi',
        resource: 'http://octopi.local/api/printerprofiles/_default',
        volume: [Object] } } }
```

See the `printerState` documentation below for error conditions.

### printerState
OctoPrint.printerState(callback);

```
{ state: 
   { flags: 
      { cancelling: false,
        closedOrError: false,
        error: false,
        operational: true,
        paused: false,
        pausing: false,
        printing: false,
        ready: true,
        sdReady: false },
     text: 'Operational' },
  temperature: {} }
```

...and when the printer can be reached but is not in the Connected state...

```
{ status: 'Printer is not operational' }
```

...and when the printer is off:

```
{ status: 'Error: getaddrinfo ENOTFOUND octopi.local' }
```

...and if the `node_modules/octo-client/config.js` has the wrong `apiKey` value:

```
{ status: 'Invalid API key' }
```

...or the value is empty:

```
{ status: 'Config error: No apiKey set in node_modules/octo-client/config.js file' }
```

## config.apiKey
Please set the `config.apiKey` value as described in the Configuration section above.

## config.hostName
If you have changed the default name of the OctoPi-imaged printer, then you should also edit this entry in the `node_modules/octo-client` folder. Remember to append `.local` after the hostname's value.

## DNS failure
If the `config.hostName` as given isn't found on the network due to the printer being off or due to a name resolution failure, any of the methods will return, for example:

```
{ status: 'Error: getaddrinfo ENOTFOUND octopi.local' }
```

Microsoft clients do not have the Bonjour protocol loaded by default and may have difficulty finding an OctoPrint instance by its hostname. This module supports using the local IP address for the `config.hostName` value.

--


|Description|Version|Author|Last Update|
|:---|:---|:---|:---|
|octo-client|v1.1.1|OutsourcedGuru|June 24, 2018|

|Donate||Cryptocurrency|
|:-----:|---|:--------:|
| ![eth-receive](https://user-images.githubusercontent.com/15971213/40564950-932d4d10-601f-11e8-90f0-459f8b32f01c.png) || ![btc-receive](https://user-images.githubusercontent.com/15971213/40564971-a2826002-601f-11e8-8d5e-eeb35ab53300.png) |
|Ethereum||Bitcoin|