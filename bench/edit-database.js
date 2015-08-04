var Client = require('../');

var ADDRESS = 'kdb://localhost:19000';

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
    database: "test",
    retention: 172800,
		maxROEpochs: 50,
		maxRWEpochs: 3,
  };

  client.edit(req, function (err, res) {
    if(err) {
      console.error(err);
    }

    process.exit(0);
  });
}
