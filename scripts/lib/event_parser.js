var fs = require('fs'),
  path = require('path');

// XXX implement me
function parseDate(d) {
  console.log("parse date?", d);
  return new Date(d);
}

// XXX implement me
function readUpdate(filePath) {
  var contents = fs.readFileSync(filePath).toString();

  // now peel off the first line if it contains a date
  var re = new RegExp(/^[a-zA-Z]+:(.*)\n/);
  var m = re.exec(contents);
  var when = null;
  if (m) {
    contents = contents.replace(re, "");
    console.log(m);
    when = parseDate(m[1]);
  } else {
    // use file time?
    // try to guess update time?
  }

  return {
    when: when,
    msg: contents.trim()
  };
}

// given a data structure representing event reports, construct a json data strcture representing
// the event
function massageEvent(data) {
  // data is an object mapping basefilename: full file path
  // we want to return
  //
  // {
  //   start: <start time in ms since epoch>
  //   duration: <event duration in s || null if the event is ongoing>,
  //   updates: [
  //     { when: <comment time in ms since epoch>, msg: <textual comment> },
  //     { when: <comment time in ms since epoch>, msg: <textual comment> },
  //     { when: <comment time in ms since epoch>, msg: <textual comment> },
  //     { when: <comment time in ms since epoch>, msg: <textual comment> }
  //   ]
  // }

  var o = {};
  
  var updates = [];

  // explicitly parse discovery document
  var update = readUpdate(data.discovery);
  o.start = update.when;
  updates.push(update);
  delete data.discovery;
  
  if (data.resolution) {
    update = readUpdate(data.resolution);
    if (update.when < o.start) throw "event cannot be resolved before it starts";
    o.duration = update.when - o.start;
    updates.push(update);
    delete data.resolution;
  }

  // read and parse all the remaining updates
  Object.keys(data).forEach(function(k) {
    var update = readUpdate(data[k]);
    if (update.when < o.start ||
        (o.duration && update.when > (o.duration + o.start))) {
      throw "event updates must occur during an event, not before or after.";
    }
    updates.push(update);
  });

  // sort updates and attach them
  console.log(updates);

  o.updates = updates.sort(function(l,r) {
    return r.when > l.when;
  });

  return o;
}


// given a directory for a single event parse all files related to the event
function parseSingleEvent(dir, cb) {
  fs.readdir(dir, function(err, paths) {  
    if (err) return cb(err);
    
    // skip dotfiles and tilde files, and remove .txt extension if present
    paths = paths.filter(function(x) {
      return x.substr(0,1) != "." && x.substr(-1) != "~";
    });

    var data = {};
    // now let's read all the files
    paths.forEach(function(p) {
      data[p.replace(/\.txt$/, "")] = path.join(dir, p);
    });

    if (!data.discovery) {
      return cb("event '" + dir + "' is missing 'discovery' file which documents discovery " +
         "of the event");
    }

    try {
      data = massageEvent(data);
    } catch(e) {
      return cb("couldn't understand event '"+dir+"': " + e);
    }

    console.log(data);
  });
}

// recursively read the events/ directory to parse all events
exports.read = function(dir, cb)  {
  fs.readdir(dir, function(err, paths) {
    if (err) return cb(err);

    var eventsByStartTime = { };
    
    (function readNextEvent() {
      if (!paths.length) {
        // now sort events by chronological order and return them
        return cb("not implemented");
      }
      var p = paths.shift();
      parseSingleEvent(path.join(dir, p), function(err, eventData) {
        if (err) return cb(err);
        eventsByStartTime[eventData.start] = eventData;
        readNextEvent();
      });
    })();
  });

};
