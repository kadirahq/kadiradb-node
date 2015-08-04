var ProtoBuf = require('protobufjs');
var path = require('path');
var fpath = path.resolve(__dirname, 'protocol.proto');
var builder = ProtoBuf.loadProtoFile(fpath);
var protocol = builder.build('kadiradb');

Object.keys(protocol).forEach(function (type) {
  protocol[type].type = type;
});

protocol.MetricsRes.format = function (res) {
  var databases = res.databases.map;
  res.databases = {};

  function fmtMap(map) {
    var formatted = {};

    for(var ts in map) {
      var val = map[ts].value;
      var imetrics = {};
      var bmetrics = {};

      for(var key in val.index) {
        var value = val.index[key];
        if(value.toNumber) {
          imetrics[key] = value.toNumber();
        }
      }

      for(var key in val.block) {
        var value = val.block[key];
        if(value.toNumber) {
          bmetrics[key] = value.toNumber();
        }
      }

      formatted[ts] = {
        index: imetrics,
        block: bmetrics
      };
    }

    return formatted;
  }

  for(var name in databases) {
    var info = databases[name].value;
    res.databases[name] = {
      rEpochs: fmtMap(info.rEpochs.map),
      wEpochs: fmtMap(info.wEpochs.map),
    };
  }

  return res;
};

module.exports = protocol;
