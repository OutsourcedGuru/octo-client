var config =           require('./config');
const dns =            require('dns');
var http =             require('http');

// --------------------------------------------------------------------------
// This is the section for helper function(s).
// --------------------------------------------------------------------------

// Returns the response from the printer, given the path
function queryPrinter(method, path, callback) {
  var options = {
    hostname:  config.hostName,       port:      80,
    path:      path,                  method:    method,
    timeout:   5000,                  headers:   {'X-Api-Key': config.apiKey}
  };
  dns.lookup(config.hostName, function(err, address) {
    if (err) {callback('{"status": "' + err + '"}'); return;}

    http.get(options, function(resp) {
      resp.setEncoding('utf8');
      var data = '';
      resp.on('data',   function(chunk)  {data += chunk;});
      resp.on('error',  function(err)    {console.log('printerState(): ' + err);});
      resp.on('end',    function()       {return callback(data);});
    });
  });
}

// --------------------------------------------------------------------------
// The exported interface consists of several methods for querying the
// printer directly. The try/catch behavior is necessary since some of the
// OctoPrint error conditions come back as plain text.
// --------------------------------------------------------------------------
module.exports = {
  // Version information - http://docs.octoprint.org/en/master/api/version.html
  version: function(callback) {
    queryPrinter('GET', '/api/version', function(response) {
      try {           return callback(JSON.parse(response));}
      catch (e) {     console.error('version(): ' + e.message); return callback({"status": response});}
    });
  },
  // Connection handling - http://docs.octoprint.org/en/master/api/connection.html
  connection: function(callback) {
    queryPrinter('GET', '/api/connection', function(response) {
      try {           return callback(JSON.parse(response));}
      catch (e) {     console.error('connection(): ' + e.message); return callback({"status": response});}
    });
  },
  // File operations - http://docs.octoprint.org/en/master/api/files.html
  files: function(bRecursive, callback) {
    queryPrinter('GET', '/api/files' + (bRecursive ? '?recursive=true' : ''), function(response) {
      try {           return callback(JSON.parse(response));}
      catch (e) {     console.error('files(): ' + e.message); return callback({"status": response});}
    });
  },
  file: function(filePath, callback) {
    queryPrinter('GET', '/api/files/local/' + filePath, function(response) {
      try {           return callback(JSON.parse(response));}
      catch (e) {     console.error('file(): ' + e.message); return callback({"status": response});}
    });
  },
  // Job operations - http://docs.octoprint.org/en/master/api/job.html
  job: function(callback) {
    queryPrinter('GET', '/api/job', function(response) {
      try {           return callback(JSON.parse(response));}
      catch (e) {     console.error('job(): ' + e.message); return callback({"status": response});}
    });
  },
  // Languages - http://docs.octoprint.org/en/master/api/languages.html
  languages: function(callback) {
    queryPrinter('GET', '/api/languages', function(response) {
      try {           return callback(JSON.parse(response));}
      catch (e) {     console.error('languages(): ' + e.message); return callback({"status": response});}
    });
  },
  // Printer operations - http://docs.octoprint.org/en/master/api/printer.html
  printerState: function(callback) {
    queryPrinter('GET', '/api/printer', function(response) {
      try {           return callback(JSON.parse(response));}
      catch (e) {     console.log('printerState(): ' + e.message); return callback({"status": response});}
    });
  }

  // ------------------------------------------------------------------------
  // End of exported function list
  // ------------------------------------------------------------------------
};
