var Client = require('../');

var BATCH_SIZE = 10;
var ADDRESS = 'kdb://localhost:19000';
var RANDOMIZE = true;
var CONCURRENCY = 5;
var DURATION = 3600;
var INDEX_FIND = true;
var GROUP_DATA = true;

var client = new Client(ADDRESS);
client.connect(function (err) {
  if(err) {
    console.error(err);
    process.exit(1);
  }

  start();
});

var counter = 0;
setInterval(function () {
  console.log(counter + "/s");
  counter = 0;
}, 1000);

function start () {
  for(var i=0; i<CONCURRENCY; ++i) {
    send();
  }
}

function send () {
  var ts2 = Math.floor(Date.now() / 1000);
  var ts1 = ts2 - DURATION;

  var req = {
    database: 'test',
    fields: ['a', 'b', 'c', 'd'],
    groupBy: [true, true, true, true],
    startTime: ts1,
    endTime: ts2,
  };

  if(GROUP_DATA) {
    req.groupBy[3] = false;
  }

  if(RANDOMIZE) {
    req.fields[0] = "a" + Math.floor(1000 * Math.random());
    req.fields[1] = "b" + Math.floor(20 * Math.random());
    req.fields[2] = "c" + Math.floor(5 * Math.random());

    if(INDEX_FIND) {
      req.fields[3] = ''
    } else {
      req.fields[3] = "d" + Math.floor(10 * Math.random());
    }
  }

  client.get(req, function (err, res) {
    if(err) {
      console.error(err);
      return;
    }

    counter++;
    send();
  });
}
