$(document).ready(function() {
  $.get('data/1.json', function(events) {
    renderHappiness(events);
    renderEvents(events);
    renderUptime(events);
  });

  function renderHappiness(events) {
    var howLong;
    if (events.length === 0 || events[0].duration != null) {
      $("#right_now .happy").show();
      howLong = moment.unix(events[0].start + events[0].duration);
    } else {
      $("#right_now .sad").show();
      howLong = moment.unix(events[0].start);
    }
    $("#right_now .timespan").text(howLong.fromNow());
  }

  function renderEvents(events) {
    var template = $("#templateEvent").html();
    for(var i=0, ev; ev = events[i]; i++) {
      var viewData = {
        duration: "a few seconds",
        duration_class: "short",
        when: moment.unix(ev.start).format('LL'),
        updates: []
      };

      // how long did it last?
      if (ev.duration) {
        var c = 'long';
        if (ev.duration < 60) c = "short";
        else if (ev.duration < (60 * 10)) c = "medium";
        viewData.duration_class = c;
        viewData.duration = moment.duration(ev.duration * 1000).humanize();
      }

      // now append specific updates
      for (var j=0, u; u = ev.updates[j]; j++) {
        viewData.updates[j] = {
          when: moment.unix(u.when).format('LT'),
          comment: u.msg
        };
      }

      var domfrag = Mustache.render(template, viewData);
      $("#history .events").append($(domfrag));
    }
  }


  function renderUptime(events) {
    var outagesThisMonth = 0;

    var secsInMonth = (30 * 24 * 60 * 60);
    var thisMonth = (new Date()).getTime() / 1000 - secsInMonth;

    for(var i=0, ev; ev = events[i]; i++) {
      // if this was less than 30 days ago, let's count the duration toward our uptime calculation
      if (ev.duration && ev.start > thisMonth) outagesThisMonth += ev.duration;

    }
    var pct = (100.0 * (secsInMonth - outagesThisMonth) / secsInMonth).toFixed(3);
    $(".happy .details .value").text(pct);
  }


});
