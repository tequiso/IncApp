_ = require 'lodash'
logger = require 'torch'
should = require 'should'

rel = require '../rel'
methodMapping = require rel 'lib/methodMapping'

describe 'methodMapping', ->

  it 'should map methods', (done) ->
    {inspect} = require 'util'

    for test in [
        portName: 'Order'
        methodName: 'SynchronizeOrder'
        expected:
          path: '/order/:Id'
          method: 'post'
          serviceName: 'Order/SynchronizeOrder'
      ,
        portName: 'Order'
        methodName: 'DeleteOrder'
        expected:
          path: '/order/:Id'
          method: 'delete'
          serviceName: 'Order/DeleteOrder'
      ,
        portName: 'Order'
        methodName: 'GetOrderById'
        expected:
          path: '/order/:Id'
          method: 'get'
          serviceName: 'Order/GetOrderById'
      ,
        portName: 'Order'
        methodName: 'UpdateOrder'
        expected:
          path: '/order/:Id'
          method: 'put'
          serviceName: 'Order/UpdateOrder'
      ,
        portName: 'Order'
        methodName: 'GetOrder'
        expected:
          path: '/order'
          method: 'get'
          serviceName: 'Order/GetOrder'
      ,
        portName: 'Order'
        methodName: 'InsertOrder'
        expected:
          path: '/order'
          method: 'post'
          serviceName: 'Order/InsertOrder'
    ]

      {portName, methodName, expected} = test
      actual = methodMapping portName, methodName
      unless _.isEqual expected, actual
        throw new Error "Expected #{methodName} route to be: \n#{inspect expected}, got: \n#{inspect actual}."

    done()
