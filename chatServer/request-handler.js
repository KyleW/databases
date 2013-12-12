
//NODE MODULES
 var url = require('url');
 var fs = require('fs');

//Where we store our messages
var messages;

var sendResponse = function(request,response,sendMe,contentType,status) {
  status = status || 200;
  contentType = contentType || 'text/html';
  response.writeHeader(status,{'Content-Type': contentType});
  response.write(sendMe);
  response.end();
};


 var handleRequest = function(request, response) {
  var toSend = "";
  var statusCode= 404;
  var urlObject = url.parse(request.url);
  var requestURL = urlObject.pathname.split('/');

  /* Without this line, this server wouldn't work. See the note below about CORS. */
  var headers = defaultCorsHeaders;

  console.log("Serving request type " + request.method + " for url " + request.url);

  if (requestURL[1] === 'classes') {

    if (request.method === "GET"){

      fs.readFile('messages.json', {encoding: 'utf8'},function(err, json){
        if (err) {throw err;}
        sendResponse(request, response, json, 'application/json');
      });
    }

    if (request.method === "POST"){
      statusCode = 201;
      headers['Content-Type'] = 'application/json';
      var fullbody = '';

      request.on('data', function(chunk){
        fullbody += chunk;
      });

      request.on('end', function(){

        fs.readFile('messages.json', {encoding: 'utf8'},function(err, json){
          if (err) {throw err;}
          messages=JSON.parse(json) || {};
          msgCount = messages.msgCount || 0;
          messages.messages = messages.messages || {};
          messages.messages[msgCount] = JSON.parse(fullbody);
          messages.msgCount = msgCount + 1;
          messages = JSON.stringify(messages);

          fs.writeFile('messages.json', messages, function(err) {
            if (err) {throw err;}
          });
          sendResponse(request, response, messages, 'application/json', 201);
        });

      });
    }
  }




  else if (requestURL[1] === "" && request.method === "GET"){
    fs.readFile('../client/index.html', function(err, html) {
      if (err) {throw err;}
      sendResponse(request,response,html);
    });
  }

  else if (requestURL[1] === "scripts" && request.method === "GET"){ //Fix This line
    var file = requestURL[2];
    fs.readFile('../client/scripts/'+file, function(err, js) {
      if (err) {throw err;}
      sendResponse(request,response,js,'text/javascript');
    });
  }

  else if (requestURL[1] === "styles" && request.method === "GET"){ //Fix This line
    var file = requestURL[2];
    fs.readFile('../client/styles/'+file, function(err, css) {
      if (err) {throw err;}
      sendResponse(request, response, css, 'text/css');
    });
  }
};

exports.handleRequest = handleRequest;

var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};
