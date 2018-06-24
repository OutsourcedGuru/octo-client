var OctoPrint = require('./index');


OctoPrint.version(function(response) {                    console.log(response); });

OctoPrint.connection(function(response){                  console.log(response); });

OctoPrint.files(null, function(response){                 console.log(response);  });
OctoPrint.files(true, function(response){                 console.log(response);  });
OctoPrint.file('3DBenchy.gcode', function(response){      console.log(response);  });

OctoPrint.job(function(response){                         console.log(response);  });

OctoPrint.languages(function(response){                   console.log(response);  });

OctoPrint.printerState(function(response){                console.log(response);  });
