$(document).ready(function() {
  $.get('data/1.json', function(events) {
    var howLong;
    if (events.length === 0 || events[0].duration != null) {
      $("#right_now .happy").show();
      howLong = moment.unix(events[0].start + events[0].duration);
    } else {
      $("#right_now .sad").show();
      howLong = moment.unix(events[0].start);
    }
    $("#right_now .timespan").text(howLong.fromNow());

    var outagesThisMonth = 0;

    var secsInMonth = (30 * 24 * 60 * 60);
    var thisMonth = (new Date()).getTime() / 1000 - secsInMonth;

    for(var i=0; i < events.length; i++) {
      var ev = events[i];
      var domfrag = $("#templates .event").clone();

      // if this was less than 30 days ago, let's count the duration toward our uptime calculation
      if (ev.duration && ev.start > thisMonth) outagesThisMonth += ev.duration;

      // when did it start?
      domfrag.find(".when").text(moment.unix(ev.start).format('LL'));

      // how long did it last?
      if (ev.duration) {
        var c = 'long';
        if (ev.duration < 60) c = "short";
        else if (ev.duration < (60 * 10)) c = "medium";
        domfrag.find(".duration").addClass(c);
        domfrag.find(".duration").text(moment.duration(ev.duration * 1000).humanize());
      } else {
        domfrag.find(".duration").addClass("long");
      }

      // now append specific updates
      for (var j=0; j < ev.updates.length; j++) {
        var u = ev.updates[j];

        var up_domfrag = $("#templates .update").clone();

        // when was the comment made?
        up_domfrag.find(".when").text(moment.unix(u.when).format('LT'));
        // what was said?
        up_domfrag.find(".comment").text(u.msg);
        
        domfrag.find(".updates").append(up_domfrag);
      } 

      $("#history .events").append(domfrag);
    }
    var pct = (100.0 * (secsInMonth - outagesThisMonth) / secsInMonth).toFixed(3);
    $(".happy .details .value").text(pct);
  });
});
