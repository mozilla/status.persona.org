#!/usr/bin/env node

var event_parser = require('./lib/event_parser.js'),
            path = require('path');

event_parser.read(path.join(__dirname, '..', 'events'), function(err, events) {
  if (err) {
    process.stderr.write("fatal error: "  + err + "\n");
    process.exit(1);
  }
  console.log(JSON.stringify(events, null, "   "));
});
