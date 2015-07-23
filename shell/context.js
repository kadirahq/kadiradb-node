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

  context.use = function(name) {
    database = name;
  }

  context.info = function() {
    return client.infoFuture().wait();
  };

  context.open = function(params) {
    return client.openFuture(params).wait();
  };

  context.open.help = function() {
    console.log('HELP_OPEN');
  }

  context.open.example = function() {
    return {
      name:          "test",
      resolution:    60e9,
      epochDuration: 3600e9,
      payloadSize:   16,
      segmentLength: 100000,
      maxROEpochs:   10,
      maxRWEpochs:   2,
    };
  };

  context.edit = function(params) {
    return client.editFuture(params).wait();
  };

  context.edit.help = function() {
    console.log('HELP_EDIT');
  }

  context.edit.example = function() {
    return {
      name:          "test",
      maxROEpochs:   50,
      maxRWEpochs:   3,
    };
  };

  context.put = function(reqs) {
    if(!Array.isArray(reqs)) {
      reqs = [reqs];
    }

    reqs.forEach(function(req) {
      req.database = req.database || database;
    });

    return client.putFuture(reqs).wait();
  };

  context.put.help = function() {
    console.log('HELP_PUT');
  };

  context.put.example = function() {
    return {
      timestamp: Date.now() * 1e6,
      fields: ['a', 'b', 'c', 'd'],
      value: 100,
      count: 10,
    };
  };

  context.inc = function(reqs) {
    if(!Array.isArray(reqs)) {
      reqs = [reqs];
    }

    reqs.forEach(function(req) {
      req.database = req.database || database;
    });

    return client.incFuture(reqs).wait();
  };

  context.inc.help = function() {
    console.log('HELP_INC');
  };

  context.inc.example = function() {
    return {
      timestamp: Date.now() * 1e6,
      fields: ['a', 'b', 'c', 'd'],
      value: 100,
      count: 10,
    };
  };

  context.get = function(reqs) {
    if(!Array.isArray(reqs)) {
      reqs = [reqs];
    }

    reqs.forEach(function(req) {
      req.database = req.database || database;
    });

    return client.getFuture(reqs).wait();
  };

  context.get.help = function() {
    console.log('HELP_PUT');
  };

  context.get.example = function() {
    var now = Date.now() * 1e6;

    return {
      startTime: now - 3600*1e6,
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
