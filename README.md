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

### languages
OctoPrint.languages(callback);

```
{ language_packs: 
   { _core: { display: 'Core', identifier: '_core', languages: [] } } }
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

## config.apiKey
Some of the methods will return information even if the `apiKey` is empty or is set incorrectly, specifically those which only only *get* information:

* version
* connection
* files
* file
* job
* languages
* printerState

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
|octo-client|v1.0.3|OutsourcedGuru|June 24, 2018|

|Donate||Cryptocurrency|
|:-----:|---|:--------:|
| ![eth-receive](https://user-images.githubusercontent.com/15971213/40564950-932d4d10-601f-11e8-90f0-459f8b32f01c.png) || ![btc-receive](https://user-images.githubusercontent.com/15971213/40564971-a2826002-601f-11e8-8d5e-eeb35ab53300.png) |
|Ethereum||Bitcoin|