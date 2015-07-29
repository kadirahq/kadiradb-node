var vm = require('vm');

function create(options) {
  var client = options.client;
  var database = null;

  var context = {};

  context.exit = function() {
    console.log('Bye!');
    process.exit(0);
  };

  context.pretty = function(val) {
    console.log(JSON.stringify(val, null, 2));
  };

  context.use = function(_database) {
    database = _database;
  }

  context.info = function() {
    return client.infoFuture().wait();
  };

  context.metrics = function() {
    return client.metricsFuture().wait();
  };

  context.open = function(req) {
    return client.openFuture(req).wait();
  };

  context.open.help = function() {
    console.log('HELP_OPEN');
  }

  context.open.example = function() {
    return {
      database: "test",
      resolution: 60,
      epochTime: 3600,
      maxROEpochs: 10,
      maxRWEpochs: 2,
    };
  };

  context.edit = function(req) {
    return client.editFuture(req).wait();
  };

  context.edit.help = function() {
    console.log('HELP_EDIT');
  }

  context.edit.example = function() {
    return {
      database: "test",
      maxROEpochs: 50,
      maxRWEpochs: 3,
    };
  };

  context.put = function(req) {
    req.database = database;
    return client.putFuture(req).wait();
  };

  context.put.help = function() {
    console.log('HELP_PUT');
  };

  context.put.example = function() {
    return {
      timestamp: Math.floor(Date.now() / 1000),
      fields: ['a', 'b', 'c', 'd'],
      value: 100,
      count: 10,
    };
  };

  context.inc = function(req) {
    req.database = database;
    return client.incFuture(req).wait();
  };

  context.inc.help = function() {
    console.log('HELP_INC');
  };

  context.inc.example = function() {
    return {
      timestamp: Math.floor(Date.now() / 1000),
      fields: ['a', 'b', 'c', 'd'],
      value: 100,
      count: 10,
    };
  };

  context.get = function(req) {
    req.database = database;
    return client.getFuture(req).wait();
  };

  context.get.help = function() {
    console.log('HELP_GET');
  };

  context.get.example = function() {
    var now = Math.floor(Date.now() / 1000);

    return {
      startTime: now - 3600,
      endTime: now,
      fields: ['a', 'b', 'c', 'd'],
      groupBy: [true, true, true, true],
    };
  };

  return vm.createContext(context);
}

module.exports = {
  create: create,
};
