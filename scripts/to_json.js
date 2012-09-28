#!/usr/bin/env node

var event_parser = require('./lib/event_parser.js'),
            path = require('path'),
          mkdirp = require('mkdirp'),
              fs = require('fs');  

const eventsDir = path.join(__dirname, '..', 'events'),
        dataDir = path.join(__dirname, '..', 'html', 'data');

mkdirp(dataDir, function(err) {
  event_parser.read(eventsDir, function(err, events) {
    if (err) {
      process.stderr.write("fatal error: "  + err + "\n");
      process.exit(1);
    }
    fs.writeFile(path.join(dataDir, "1.json"), JSON.stringify(events));
  });
});
