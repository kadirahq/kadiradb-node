var Client = require('../');

var ADDRESS = 'kdb://localhost:19000';
var RANDOMIZE = true;
var CONCURRENCY = 5;

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
  var req = {
    database: 'test',
    timestamp: Math.floor(Date.now() / 1000),
    fields: ['a', 'b', 'c', 'd'],
    value: 100,
    count: 10,
  };

  if(RANDOMIZE) {
    req.fields[0] = "a" + Math.floor(1000 * Math.random());
    req.fields[1] = "b" + Math.floor(20 * Math.random());
    req.fields[2] = "c" + Math.floor(5 * Math.random());
    req.fields[3] = "d" + Math.floor(10 * Math.random());
  }

  client.put(req, function (err, res) {
    if(err) {
      console.error(err);
      return;
    }

    counter++;
    send();
  });
}
