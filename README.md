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
    var targetHotend1 = ptr.state.temperature.tool0.target;
    // etc
  }
});

```


--


|Description|Version|Author|Last Update|
|:---|:---|:---|:---|
|octo-client|v1.0.1|OutsourcedGuru|June 23, 2018|

|Donate||Cryptocurrency|
|:-----:|---|:--------:|
| ![eth-receive](https://user-images.githubusercontent.com/15971213/40564950-932d4d10-601f-11e8-90f0-459f8b32f01c.png) || ![btc-receive](https://user-images.githubusercontent.com/15971213/40564971-a2826002-601f-11e8-8d5e-eeb35ab53300.png) |
|Ethereum||Bitcoin|