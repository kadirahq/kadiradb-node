var vm = require('vm');
var repl = require('repl');
var Future = require('fibers/future');
var Client = require('../');
var Context = require('./context');

Future.task(function() {
  var args = {
    address: process.argv[2] || 'kmdb://localhost:19000',
    database: process.argv[3],
  };

  var client = Future.wrap(new Client(args.address));
  client.connectFuture().wait();

  var shell = repl.start({
    ignoreUndefined: true,
    eval: evalInFibers,
  });

  shell.context = Context.create({
    client: client,
    database: args.database,
  });
}).detach();


function evalInFibers(cmd, ctx, file, callback) {
  Future.task(function() {
    try {
      var res = vm.runInContext(cmd, ctx);
    } catch (e) {
      callback(e)
    }

    callback(null, res);
  }).detach();
}
