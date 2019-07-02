{exists} = require 'fs'
soap = require 'soap'

module.exports = ({wsdlPath, username, password, sessionType}, done) ->
  return done new Error "wsdlPath required!" unless wsdlPath?
  sessionType ?= 'None'

  exists wsdlPath, (result) ->
    unless result
      return done new Error 'WSDL def not found!'

    soap.createClient wsdlPath, (err, client) ->
      return done err if err?

      soapHeaders = [
        "<UsernameToken xmlns='http://siebel.com/webservices'>#{username}</UsernameToken>"
        "<PasswordText xmlns='http://siebel.com/webservices'>#{password}</PasswordText>"
        "<SessionType xmlns='http://siebel.com/webservices'>#{sessionType}</SessionType>"
      ]
      for header in soapHeaders
        client.addSoapHeader header

      done null, client
