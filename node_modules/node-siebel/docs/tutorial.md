# Introduction

If you’re currently working with Siebel you might be familiar with their SOAP interface.  When the software was originally developed, this was in accordance with best practices.  However, today REST has become the dominant standard for connectivity on the web, so if you’re consuming Siebel with Ruby, PHP, Python, .NET, you’re probably looking for a REST API.  Siebel does support REST, but you must buy Fusion Middleware, a costly addon to your existing platform.

This tutorial will give you basic steps for consuming the SOAP API directly from Node.js.  You’ll see that the SOAP connection is fairly straightforward with the help of some libraries.  Our demonstration will use the order creation service - which is what you’d use if you were building an ecommerce site that needed to submit orders to Siebel.

By consuming SOAP directly, we can avoid the extra costs of the REST translation, with very little down side.

# Siebel API Overview

Siebel’s API is organized by:

<strong>Service</strong> - This is a high level grouping that covers a whole area of the API.  For instance, we’ll be working with the Order Management service.<br/>
<strong>Port</strong> - This is a specific resource managed by the service.  For instance, within the Order Management service you will find two ports - Order and OrderItem.<br/>
<strong>Method</strong> - This is the actual process that you will interact with.  Among others each PORT will have the familiar CRUD operations.

<strong>Termonology</strong>: When I say “service” I often mean a single function, which in Siebel/SOAP terminology is a “method”.  Sorry in advance for any confusion.

You can find a reference for the Siebel Order Management API [here](http://docs.oracle.com/cd/E14004_01/books/OrdMgt/OrdMgtTOC.html).  Scroll to the bottom section for a list of the methods.

# What You’ll Need

### Siebel instance v7.8 or later

I’m going to assume that if you’re reading this article you’re probably already using Siebel and have an instance available.

### Node.js v0.10.0 or later

You’ll need this to run our sample code.  Node includes a package manager (npm) which will bring in all the other dependencies we need.

### A terminal

If you’re in Windows I’d recommend [git-bash](https://help.github.com/articles/set-up-git#platform-windows).

### A text editor

Whatever you’re comfortable with here.  My code is written in CoffeeScript with 2 spaces for indentation, so if you’re going to edit that, make sure you’re not mixing tabs in or you’ll get strange syntax errors.

# Overview of the Node-Siebel Project

The primary responsibilities we’ve taken on with node-siebel are:

1. Generate services that can be called programmatically.  We make some assumptions about the data formats in an attempt to make your life easier, so this probably won’t work for a non-Siebel API.
2. Create a REST router for the services and hand it back to you.  This is something you can plug in as express/connect/http middleware in node, and start serving your REST endpoints in just a few lines of code.

Let’s walk through the included tests, which should give you a sense of how to utilize this functionality in your own app.  Go ahead and open the tests, which you’ll find [here](https://github.com/Pravici/node-siebel/blob/master/test/serviceGenerator.coffee).

The first test, “should generate services” shows the services that will be generated from the sample WSDL, which is for the Order service.  Each “service” in our world corresponds to a “method” in the SOAP world.

The next test “should create an order” demonstrates calling a service.  If you look at the [sample data](https://github.com/Pravici/node-siebel/blob/master/data/order_sample.coffee) being passed, you’ll notice that it differs from the message schema in the WSDL.  Namely, the header elements are included for you, and you are just responsible for specifying the fields in a single document, represented as an object.  This is in attempt to be more consistent with what I would expect from a REST interface.  You’ll still need to provide the list/header elements for any sub-documents (e.g. OrderItems).  Refer to the WSDL for the exact schema, and print the [last request](https://github.com/Pravici/node-siebel/blob/master/lib/serviceGenerator.coffee#L51) if you're unsure what's being sent.

NOTE:  The Id and OrderNumber fields have a unique constraint, so you’ll need to change the values in order to run this multiple times.

The next test “should list orders” doesn’t really add much that’s new, but it’s not stateful, so you can safely run it many times.

The last test, “should generate REST API” is an integration test.  It should be pretty close to the code you’d need to integrate with your own application.

You’ll notice that in addition to returning a set of services, the serviceGenerator also gives you a router.  This can be plugged into connect or express, just as any other middleware would be.  It has REST routes preconfigured that will forward your requests to the node-soap client, which communicates with the SOAP interface.

The code used to configure the connect middleware and start a server is standard boilerplate, and well documented in the [Connect](http://www.senchalabs.org/connect/) project.

# Using Your Own Siebel Services

Assuming your API follows the same conventions as the Siebel standard methods, things will be easy.  (Nothing is easy though, so brace yourself.)

## Install Node-Siebel

```bash
npm install --save node-siebel
```

## Obtain a WSDL

To communicate with other standard Services, or a custom one that you’ve created, you’ll need a WSDL file.  This is an XML file that contains a description of where the service is and what it’s capabilities and requirements are.

Let’s go grab one from Administration - Web Services.

1. Make sure the Siebel instance is running.
2. Navigate to the Siebel Client in Internet Explorer.
3. Log in as sadmin.
4. Go to the Administrative - Web Services tab.
5. Find the service you want to connect to and select it.
6. Click the Generate WSDL button and complete the wizard.
7. Transfer the WSDL file to the machine and project directory where you’ll be coding.

For reference, the Administrative - Web Services screen should look like this:

![web services interface](https://raw.github.com/Pravici/node-siebel/master/docs/webservices.png "Web Services interface")

Towards the end of your WSDL file you will find one or more &lt;soap:address&gt; fields.  You’ll need to modify the hostnames to match the actual location of your dev server.  I found in my tests that I needed to change SecureWebService to WebService, and add &amp;WSSOAP=1 at the end.  Here’s [some info](http://docs.oracle.com/cd/E14004_01/books/EAI2/EAI2_WebServices32.html) about the setting.

## Connecting

Look at our [test helper](https://github.com/Pravici/node-siebel/blob/master/test/helpers/getClient.coffee) for an example of how to initialize the Node-Soap library... or follow the [node-soap docs](https://github.com/vpulim/node-soap).

## Option A: Programmatic Access

You can probably just use the node-soap client directly if you just need programmatic access.  But if you prefer to not have to include the headers in the document, go ahead and follow the “should create an order” test example.

## Option B: REST Access

Follow the example on in the main [README](https://github.com/Pravici/node-siebel/blob/master/README.md).  This should have everything you need.

# Conclusion

You might have to poke around a bit and make modifications in order to get this to work with your specific instance.  If you have any feedback for improvement, or notice something we left out, please let us know by using the issue tracker!
