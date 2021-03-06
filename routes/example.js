/ get HTTP modules
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

soap.createClient(wsdlPath, function (err, client) {
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

/* REST endpoints will be generated based on the WSDL you provide. An example Siebel Order Management WSDL is provided which will generate the following endpoints:

POST   /order/:Id  =>  Order/SynchronizeOrder
DELETE /order/:Id  =>  Order/DeleteOrder
GET    /order/:Id  =>  Order/GetOrderById
PUT    /order/:Id  =>  Order/UpdateOrder
GET    /order      =>  Order/GetOrder
POST   /order      =>  Order/InsertOrder
 
anything else
 
POST /order/<action>  =>  Order/<action>
*/