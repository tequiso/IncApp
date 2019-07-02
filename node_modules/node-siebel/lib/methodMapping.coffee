module.exports = (portName, methodName) ->
  serviceName = "#{portName}/#{methodName}"
  base = portName.toLowerCase()
  path = serviceName.toLowerCase()

  switch methodName
    when "Synchronize#{portName}"
      path: "/#{base}/:Id"
      method: "post"
      serviceName: serviceName

    when "Delete#{portName}"
      path: "/#{base}/:Id"
      method: 'delete'
      serviceName: serviceName

    when "Get#{portName}ById"
      path: "/#{base}/:Id"
      method: 'get'
      serviceName: serviceName

    when "Update#{portName}"
      path: "/#{base}/:Id"
      method: 'put'
      serviceName: serviceName

    when "Get#{portName}"
      path: "/#{base}"
      method: 'get'
      serviceName: serviceName

    when "Insert#{portName}"
      path: "/#{base}"
      method: 'post'
      serviceName: serviceName

    else
      path: "/#{base}/#{path}"
      method: 'post'
      serviceName: serviceName
