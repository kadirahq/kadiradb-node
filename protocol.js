var ProtoBuf = require('protobufjs');
var path = require('path');
var fpath = path.resolve(__dirname, 'protocol.proto');
var builder = ProtoBuf.loadProtoFile(fpath);
var protocol = builder.build('kadiradb');

Object.keys(protocol).forEach(function (type) {
  protocol[type].type = type;
});

module.exports = protocol;
