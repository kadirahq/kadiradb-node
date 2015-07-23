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
  var params = {
    name:          "test",
		maxROEpochs:   50,
		maxRWEpochs:   3,
  };

  client.edit(params, function (err, res) {
    if(err) {
      console.error(err);
    }

    process.exit(0);
  });
}
