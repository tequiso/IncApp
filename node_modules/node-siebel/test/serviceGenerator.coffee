_ = require 'lodash'
logger = require 'torch'
should = require 'should'

# helper to locate files relative to project root
{join} = require 'path'
rel = (paths...) -> join __dirname, '..', paths...

getClient = require rel 'test/helpers/getClient'
serviceGenerator = require rel '.'

describe 'Generator', ->
  before (done) ->

    # Create a node-soap client based on this WSDL.
    # NOTE: This may be all you need if you just want programmatic access.
    getClient {wsdlPath: rel('data/OrderWebService.WSDL'), username: 'SADMIN', password: 'SADMIN'}, (err, @client) =>
      should.not.exist err
      done()

  it 'should generate services', (done) ->

    # generate a set of services (can be called programmatically)
    {services} = serviceGenerator(@client)

    services.should.have.keys [
      "Order/SynchronizeOrder", "Order/DeleteOrder", "Order/GetOrderById",
      "Order/UpdateOrder", "Order/GetOrder", "Order/InsertOrder",
      "OrderItem/GetOrderItemById", "OrderItem/GetOrderItem", "OrderItem/DeleteOrderItem",
      "OrderItem/InsertOrderItem", "OrderItem/UpdateOrderItem", "OrderItem/SynchronizeOrderItem"
    ]

    done()

  it 'should create an order', (done) ->
    @timeout 0

    # generate a set of services (can be called programmatically)
    {services} = serviceGenerator(@client)

    # get our sample order
    body = require rel 'data/order_sample'

    # send the request to the SOAP API
    services['Order/InsertOrder'] body, (err, result) ->

      if err
        logger.blue _.pick result, ['headers', 'statusCode']
      else
        logger.blue {err, result}

      should.not.exist err
      should.exist result

      done()

  it 'should list orders', (done) ->
    @timeout 0

    # generate a set of services (can be called programmatically)
    {services} = serviceGenerator(@client)

    body = {OrderNumber: '1-7SDFTMXYZW'}

    services['Order/GetOrder'] body, (err, result) ->

      if err
        logger.blue _.pick result, ['headers', 'statusCode']
      else
        logger.blue {err, result}

      should.not.exist err
      should.exist result

      done()

  it 'should generate REST API', (done) ->
    @timeout 0

    connect = require 'connect'
    http = require 'http'
    request = require 'request'

    # generate a set of services (can be called programmatically)
    # and a router (a REST API that can be plugged in as http/connect/express middleware)
    {services, router} = serviceGenerator(@client)

    # demonstrate setup of a REST server
    server = connect()
    server.use connect.bodyParser()
    server.use router

    # REST services are live
    http.createServer(server).listen 4000, ->

      # test with a sample request
      request.get 'http://localhost:4000/order/new', (err, response, body) ->
        logger.cyan {err, body}
        should.not.exist err
        response.statusCode.should.eql 200

        done()
