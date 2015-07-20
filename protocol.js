var ProtoBuf = require('protobufjs');
var path = require('path');
var fpath = path.resolve(__dirname, 'protocol.proto');
var builder = ProtoBuf.loadProtoFile(fpath);
module.exports = builder.build('kmdb');
