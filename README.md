# KadiraDB

NodejS client for KadiraDB database and a shell to interact with the database server.



## Installing

Use npm to install the module.

``` shell
npm install --save kadiradb
```

A connection should be made before making requests. The client has some useful methods which can be seen under the **Module API** section below.

``` javascript
var KadiraDB = require('kadiradb');
var client = new KadiraDB('kdb://localhost:19000');

client.connect(function (err) {
  if(err) {
    console.error(err);
    throw err;
  }

  // client is ready
});
```



## KadiraDB Shell

Instilling it globally also installs the `kadiradb` command line tool. Which is an interactive shell useful for interacting with and debugging the database server. The `kadiradb` command accepts 2 arguments (both are optional).

``` shell
npm install --global kadiradb
kadiradb 'kdb://localhost:19000' 'mydb'
```

### Crating a DB

Let's assume that we need to create **a database to store the temperature of major cities in Sri Lanka with 1-minute resolution and we need to keep data for 30 days**. Run this command in your kadiradb shell.

``` javascript
❯ open({database: 'temperature', resolution: 60, retention: 2592000, epochTime: 86400, maxROEpochs: 10, maxRWEpochs: 2})
{}
```

*Note: The resolution, retention, epochTime parameters are given in seconds.*

You can verify that the database is crated successfully with the info command.

``` javascript
❯ info()
{ databases: [ { database: 'temperature', resolution: 60, retention: 0 } ] }
```

### Writing Data

From the shell, select the database to write to with the `use` function and write some temperature values with the `put` function.

``` javascript
❯ use('temperature')
❯ var time = Math.floor(Date.now()/1000);
❯ var fields = ['WP', 'Colombo', 'Dematagoda'];
❯ put({"timestamp": time, fields: fields, value: 100, count: 10})
```

### Reading Data

The get method can be used to read data from the database.

``` javascript
❯ var groupBy = [true, true, true];
❯ get({startTime: time-120, endTime: time+60, fields: fields, groupBy: groupBy})
{ groups: [ { fields: [Object], points: [Object] } ] }
❯ pretty(_)
{
  ...
}
```



## Module API

### connect

Connects to a database server. When the connection closes, the client will automatically try to reconnect (unless the connection was closed by the user).

``` javascript
client.connect(function(err) {
	//
});
```

### open

Open creates a database if it doesn't exist. Resolution, Retention and EpochTime parameters must be given in seconds. Maximum read-only epochs and maximum read-write epochs can be adjusted to balance response performance and memory requirements.

``` javascript
var req = {
	database: "test",
	resolution: 60,
	retention: 86400,
	epochTime: 3600,
	maxROEpochs: 10,
	maxRWEpochs: 2,
};

client.open(req, function(err) {
	//
});
```

### edit

Edit method can be sued to update some parameters of a database. Only some parameters are allowed to be changed with the edit method.

``` javascript
var req = {
	database: "test",
	retention: 86400,
	maxROEpochs: 10,
	maxRWEpochs: 2,
};

client.edit(req, function(err) {
	//
});
```

### info

Info method can be used to get information about the server and available databases.

``` javascript
client.info(function(err, res) {
	// res = {
    //   databases: [
    //     {database: "test", resolution: 60, retention: 86400}
    //   ]
	// }
});
```

### metrics

Get server performance metrics from the database. Useful when debugging performance issues and for performance tuning.

``` javascript
client.metrics(function(err, res) {
	// res = {
    //   databases: {
    //     'test': { ... }
    //   }
    // }
});
```

### put

Put stores a data point in the database. The timestamp should be given in seconds.

``` javascript
var req = {
	database: "test",
	timestamp: 1438261776,
	fields: [ 'a', 'b', 'c', 'd' ],
	value: 100,
	count: 10
};

client.put(req, function(err) {
	//
});
```

### putBatch

Store a set of data points into one or more databases. `reqs` is an array of put requests.

``` javascript
client.putBatch(reqs, function(err) {
	//
});
```

### inc

Increment values of a data point in a database.

``` javascript
var req = {
	database: "test",
	timestamp: 1438261776,
	fields: [ 'a', 'b', 'c', 'd' ],
	value: 100,
	count: 10
};

client.inc(req, function(err) {
	//
});
```

### incBatch

Increment values of a few data points in one or more databases. `reqs` is an array of inc requests.

``` javascript
client.incBatch(reqs, function(err) {
	//
});
```

### get

Fetch a set of data from a database.

``` javascript
var req = {
	database: 'test',
	fields: ['a', 'b', 'c', 'd'],
	groupBy: [true, true, true, true],
	startTime: 1438261776,
	endTime: 1438261896,
};

client.get(req, function(err, res) {
   // res = {
   //   groups: [
   //     {
   //       fields: [ 'a', 'b', 'c', 'd' ]
   //       points: [
   //         {value: 100, count: 10}
   //       ]
   //     }
   //   ]
   // }
});
```

### getBatch

Request  a batch of one or more get requests. `reqs` is an array of get requests.

``` javascript
client.getBatch(reqs, function(err) {
	//
});
```

### close

Close the connection.

```
client.close(reqs, function(err) {
  //
});
```



```
client.connect(function(err) {
  //
});
```
