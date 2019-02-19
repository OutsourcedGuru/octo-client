var config =           require('./config');
const dns =            require('dns');
var http =             require('http');

// --------------------------------------------------------------------------
// This is the section for helper function(s).
// --------------------------------------------------------------------------

// Returns the response from the printer, given the path
function queryPrinter(method, path, body, callback) {
  if (config.apiKey == '') {
    return callback('{"status": "Config error: No apiKey set in node_modules/octo-client/config.js file"}');
  }
  var options;
  if (body) {
    var postData = JSON.stringify(body);
    options = {
      hostname:  config.hostName,  port: config.port,  path: path,  method: method,  timeout: 5000,
      headers:   {
                 'X-Api-Key':      config.apiKey,
                 'Content-Type':   'application/json',
                 'Content-Length': Buffer.byteLength(postData)
                 }
    };  // options = ...
  } else {
    options = {
      hostname:  config.hostName,  port: config.port,  path: path,  method: method,  timeout: 5000,
      headers:   {
                 'X-Api-Key':      config.apiKey,
                 'Content-Type':   'application/json'
                 }
    };  // options = ...
  }     // if (body)
  dns.lookup(config.hostName, function(err, address) {
    if (err) {callback('{"status": "' + err + '"}'); return;}

    if (method == "GET") {
      http.get(options, function(resp) {
        resp.setEncoding('utf8');
        var data = '';
        resp.on('data',   function(chunk)  {data += chunk;});
        resp.on('error',  function(err)    {console.log('queryPrinter(): ' + err);});
        resp.on('end',    function()       {return callback(data);});
      });
    } else if (method == "POST") {
      var req = http.request(options, function(resp) {
        resp.setEncoding('utf8');
        var data = '';
        resp.on('data',   function(chunk)  {data += chunk;});
        resp.on('end',    function()       {
          if (resp.statusCode == 204) return callback('{"status": "Success"}');
          return callback(data);
        });  // resp.on('end')
      });    // var req = ...
      req.on('error',     function(err)    {console.log('queryPrinter(): ' + err);});
      req.write(postData);
      req.end();
    } else {
      // Unsupported method sent in
      callback({"status": "Unknown method sent to queryPrinter(): " + method});
    }  // if (method...)
  });  // dns.lookup()
}      // function queryPrinter()

// --------------------------------------------------------------------------
// The exported interface consists of several methods for querying the
// printer directly. The try/catch behavior is necessary since some of the
// OctoPrint error conditions come back as plain text.
// --------------------------------------------------------------------------
module.exports = {
  // Version information - http://docs.octoprint.org/en/master/api/version.html
  version: function(callback) {
    queryPrinter('GET', '/api/version', null, function(response) {
      try {           return callback(JSON.parse(response));}
      catch (e) {     console.error('version(): ' + e.message); return callback({"status": response});}
    });
  },
  // Connection handling - http://docs.octoprint.org/en/master/api/connection.html
  connection: function(callback) {
    queryPrinter('GET', '/api/connection', null, function(response) {
      try {           return callback(JSON.parse(response));}
      catch (e) {     console.error('connection(): ' + e.message); return callback({"status": response});}
    });
  },
  connect: function(callback) {
    var body = {"command": "connect"};
    queryPrinter('POST', '/api/connection', body, function(response) {
      try {           return callback(JSON.parse(response));}
      catch (e) {     console.log('connect(): ' + e.message); return callback({"status": response});}
    });
  },
  disconnect: function(callback) {
    var body = {"command": "disconnect"};
    queryPrinter('POST', '/api/connection', body, function(response) {
      try {           return callback(JSON.parse(response));}
      catch (e) {     console.log('disconnect(): ' + e.message); return callback({"status": response});}
    });
  },
  // File operations - http://docs.octoprint.org/en/master/api/files.html
  files: function(bRecursive, callback) {
    queryPrinter('GET', '/api/files' + (bRecursive ? '?recursive=true' : ''), null, function(response) {
      try {           return callback(JSON.parse(response));}
      catch (e) {     console.error('files(): ' + e.message); return callback({"status": response});}
    });
  },
  file: function(filePath, callback) {
    queryPrinter('GET', '/api/files/local/' + filePath, null, function(response) {
      try {           return callback(JSON.parse(response));}
      catch (e) {     console.error('file(): ' + e.message); return callback({"status": response});}
    });
  },
  selectFile: function(filePath, bPrint, callback) {
    var body = {"command": "select", "print": bPrint};
    queryPrinter('POST', '/api/files/local/' + filePath, body, function(response) {
      try {           return callback(JSON.parse(response));}
      catch (e) {     console.error('selectFile(): ' + e.message); return callback({"status": response});}
    });
  },
  // Job operations - http://docs.octoprint.org/en/master/api/job.html
  job: function(callback) {
    queryPrinter('GET', '/api/job', null, function(response) {
      try {           return callback(JSON.parse(response));}
      catch (e) {     console.error('job(): ' + e.message); return callback({"status": response});}
    });
  },
  jobStart: function(callback) {
    var body = {"command": "start"};
    queryPrinter('POST', '/api/job', body, function(response) {
      try {           return callback(JSON.parse(response));}
      catch (e) {     console.error('jobStart(): ' + e.message); return callback({"status": response});}
    });
  },
  jobCancel: function(callback) {
    var body = {"command": "cancel"};
    queryPrinter('POST', '/api/job', body, function(response) {
      try {           return callback(JSON.parse(response));}
      catch (e) {     console.error('jobCancel(): ' + e.message); return callback({"status": response});}
    });
  },
  jobPause: function(callback) {
    var body = {"command": "pause", "action": "pause"};
    queryPrinter('POST', '/api/job', body, function(response) {
      try {           return callback(JSON.parse(response));}
      catch (e) {     console.error('jobPause(): ' + e.message); return callback({"status": response});}
    });
  },
  jobResume: function(callback) {
    var body = {"command": "pause", "action": "resume"};
    queryPrinter('POST', '/api/job', body, function(response) {
      try {           return callback(JSON.parse(response));}
      catch (e) {     console.error('jobResume(): ' + e.message); return callback({"status": response});}
    });
  },
  // Languages - http://docs.octoprint.org/en/master/api/languages.html
  languages: function(callback) {
    queryPrinter('GET', '/api/languages', null, function(response) {
      try {           return callback(JSON.parse(response));}
      catch (e) {     console.error('languages(): ' + e.message); return callback({"status": response});}
    });
  },
  // Settings - http://docs.octoprint.org/en/master/api/settings.html
  settings: function(callback) {
    queryPrinter('GET', '/api/settings', null, function(response) {
      try {           return callback(JSON.parse(response));}
      catch (e) {     console.error('settings(): ' + e.message); return callback({"status": response});}
    });
  },
  // System - http://docs.octoprint.org/en/master/api/system.html
  systemCommands: function(bCustom, callback) {
    queryPrinter('GET', '/api/system/commands' + (bCustom ? '/custom' : ''), null, function(response) {
      try {           return callback(JSON.parse(response));}
      catch (e) {     console.error('systemCommands(): ' + e.message); return callback({"status": response});}
    });
  },
  systemReboot: function(callback) {
    var body = {};
    queryPrinter('POST', '/api/system/commands/core/reboot', body, function(response) {
      try {           return callback(JSON.parse(response));}
      catch (e) {     console.error('systemReboot(): ' + e.message); return callback({"status": response});}
    });
  },
  systemRestart: function(callback) {
    var body = {};
    queryPrinter('POST', '/api/system/commands/core/restart', body, function(response) {
      try {           return callback(JSON.parse(response));}
      catch (e) {     console.error('systemRestart(): ' + e.message); return callback({"status": response});}
    });
  },
  systemShutdown: function(callback) {
    var body = {};
    queryPrinter('POST', '/api/system/commands/core/shutdown', body, function(response) {
      try {           return callback(JSON.parse(response));}
      catch (e) {     console.error('systemShutdown(): ' + e.message); return callback({"status": response});}
    });
  },
  // Timelapse operations - http://docs.octoprint.org/en/master/api/timelapse.html
  timelapse: function(callback) {
    queryPrinter('GET', '/api/timelapse', null, function(response) {
      try {           return callback(JSON.parse(response));}
      catch (e) {     console.error('timelapse(): ' + e.message); return callback({"status": response});}
    });
  },
  // Printer operations - http://docs.octoprint.org/en/master/api/printer.html
  printerState: function(callback) {
    queryPrinter('GET', '/api/printer', null, function(response) {
      try {           return callback(JSON.parse(response));}
      catch (e) {     console.log('printerState(): ' + e.message); return callback({"status": response});}
    });
  },
  // Printer profile operations - http://docs.octoprint.org/en/master/api/printerprofiles.html
  printerProfiles: function(callback) {
    queryPrinter('GET', '/api/printerprofiles', null, function(response) {
      try {           return callback(JSON.parse(response));}
      catch (e) {     console.log('printerProfiles(): ' + e.message); return callback({"status": response});}
    });
  }

  // ------------------------------------------------------------------------
  // End of exported function list
  // ------------------------------------------------------------------------
};
