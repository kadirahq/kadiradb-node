var Client = require('../');

var ADDRESS = 'kmdb://localhost:19000';

var client = new Client(ADDRESS);
client.connect(function (err) {
  if(err) {
    console.error(err);
    process.exit(1);
  }

  start();
});

function start () {
  var req = {
    name: "test",
		resolution: 60,
		epochTime: 3600,
		maxROEpochs: 10,
		maxRWEpochs: 2,
  };

  client.open(req, function (err, res) {
    if(err) {
      console.error(err);
    }

    process.exit(0);
  });
}
