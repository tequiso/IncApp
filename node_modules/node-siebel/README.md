## Node-Siebel

The tests in this library demonstrate connecting to Siebel using the node-soap library.  In addition, this library can be used to generate a REST server which forwards requests to Siebel's SOAP API.

# Install

```bash
npm install node-siebel
```

# Run Tests

```bash
npm install -g mocha
mocha
```

# Tutorial

For more details and background, please see the [tutorial](https://github.com/Pravici/node-siebel/blob/master/docs/tutorial.md).

# Create A REST Server

With some minor changes, this should allow you to start a REST server that forwards requests to a node-soap client.

This is from [example.js](https://github.com/Pravici/node-siebel/blob/master/example/example.js).

```javascript
// get HTTP modules
var connect = require('connect'),
    http = require('http'),
    request = require('request'),
    server = connect();

// create a node-soap client
var soap = require('soap'),
    join = require('path').join,
    wsdlPath = join(__dirname, "../data/OrderWebService.WSDL"),
    username = 'SADMIN',
    password = 'SADMIN',
    sessionType = 'None';

soap.createClient(wsdlPath, function(err, client) {
    if (err) {
      throw err;
    };

    client.addSoapHeader("<UsernameToken xmlns='http://siebel.com/webservices'>" + username + "</UsernameToken>");
    client.addSoapHeader("<PasswordText xmlns='http://siebel.com/webservices'>" + password + "</PasswordText>");
    client.addSoapHeader("<SessionType xmlns='http://siebel.com/webservices'>" + sessionType + "</SessionType>");

    // create a REST router to forward to the node-soap client
    var serviceGenerator = require('node-siebel'),
        router = serviceGenerator(client).router;

    // connect the router and start the server
    server.use(connect.bodyParser());
    server.use(router);
    http.createServer(server).listen(4000);
});

```

REST endpoints will be generated based on the WSDL you provide.  An example Siebel Order Management WSDL is provided which will generate the following endpoints:

```text
POST   /order/:Id  =>  Order/SynchronizeOrder
DELETE /order/:Id  =>  Order/DeleteOrder
GET    /order/:Id  =>  Order/GetOrderById
PUT    /order/:Id  =>  Order/UpdateOrder
GET    /order      =>  Order/GetOrder
POST   /order      =>  Order/InsertOrder

anything else

POST /order/<action>  =>  Order/<action>
```

## Copyright

Copyright (c) 2014 Pravici, LLC
License: MIT
