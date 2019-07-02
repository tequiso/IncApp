{create} = require 'law'
lawAdapter = require 'law-connect'

logger = require 'torch'
_ = require 'lodash'

methodMapping = require './methodMapping'

module.exports = (client) ->

  lawServices = {}
  routeDefs = []

  # loop through services/ports/methods
  soapServices = _.filter _.keys(client), (k) -> /Service/.test k
  for s in soapServices # services
    for p, methods of client[s] # ports
      portName = p.match(/(.+)Port/)?[1]
      portName ?= p

      portHeader = {}
      #portHeader["ListOf#{portName}"] = {}
      #portHeader["ListOf#{portName}"]["ListOf#{portName}Header"] = {}

      for m, mFn of methods # methods

        serviceName = "#{portName}/#{m}"
        #logger.blue {serviceName}

        # generate law services
        do (portHeader, portName, m, mFn) ->
          lawServices[serviceName] = {
            service: (args, done) ->

              if /Get(.*)ById/.test m
                message = {'PrimaryRowId': args['Id']}
              else
                message = args
                #message = _.clone portHeader
                #message["ListOf#{portName}"]["ListOf#{portName}Header"][portName] = args

              # forward the request to the node-soap client
              mFn message, (err, result) ->

                #if err
                  #logger.red _.pick result, ['headers', 'statusCode']
                #else
                  #logger.yellow {err, result}

                done err, result

              #logger.magenta client.lastRequest
          }

        # generate route definitions
        routeDefs.push methodMapping(portName, m)

        # OrderWebService, OrderPort, SynchronizeOrder
        #logger.blue {s, p, m}

  services = create {services: lawServices}
  router = lawAdapter {services, routeDefs}

  return {services, router}
