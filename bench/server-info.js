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
  client.info(function (err, res) {
    if(err) {
      console.error(err);
    }

    console.log(res);
    process.exit(0);
  });
}
