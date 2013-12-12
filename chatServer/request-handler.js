
//NODE MODULES
var url = require('url');
var fs = require('fs');
var mysql = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  database : 'chat'
});

// connection.connect();

// connection.query("INSERT into users (username) values ('testUser')", function(err, rows, fields) {
//   if (err) throw err;

//   // console.log('Inserted: ', rows[0]);
// });

// connection.query("SELECT * from users", function(err, rows, fields) {
//   if (err) throw err;

//   console.log('Inserted: ', rows[0]);
// });

// connection.end();





//Where we store our messages
var messages;

var sendResponse = function(request,response,sendMe,contentType,status) {
  status = status || 200;
  contentType = contentType || 'text/html';
  response.writeHeader(status,{'Content-Type': contentType});
  response.write(sendMe);
  response.end();
};


////////////////////////////////////////////////////////////////////////////////////

var getUserid = function (username) {
  var user;
  connection.query("SELECT user_id from users WHERE username='" + username + "'", function (err, rows, fields) {
    if (err) throw err;
    if (rows[0]){
      user = rows[0].user_id;
    } else {
      connection.query("INSERT into users (username) values ('" + username + "')", function (err,result) {
        if (err) throw err;
        user = result.insertId;
      });
    }
  });
  return user;
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

      connection.connect();

      connection.query("SELECT * from messages", function(err, rows, fields) {
        if (err) throw err;
        sendResponse(request, response, JSON.stringify(rows), 'application/json');
        console.log('Heres what we sent: ', rows);

        connection.end();
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

        var newMessage = JSON.parse(fullbody);

        connection.connect();

        //Get user_id or create user_id
        var user_id = getUserid(newMessage);

        //Get room_id or create room_id
        var room_id = getRoomid(newMessage);

        connection.query("INSERT into messages (text) values ('" + newMessage.text + "')", function(err, rows, fields) {
          if (err) throw err;
          sendResponse(request, response, '', 'application/json', 201);
          connection.end();
        });
      });
    }
  }

////////// SERVES STATIC FILES ////////////////////

  else if (requestURL[1] === "" && request.method === "GET"){
    fs.readFile('../chatClient/index.html', function(err, html) {
      if (err) {throw err;}
      sendResponse(request,response,html);
    });
  }

  else if (requestURL[1] === "scripts" && requestURL[2] === "models" && request.method === "GET"){ //Fix This line
    var file = requestURL[3];
    fs.readFile('../chatClient/scripts/models/'+file, function(err, js) {
      if (err) {throw err;}
      sendResponse(request,response,js,'text/javascript');
    });
  }

  else if (requestURL[1] === "scripts" && requestURL[2] === "views" && request.method === "GET"){ //Fix This line
    var file = requestURL[3];
    fs.readFile('../chatClient/scripts/views/'+file, function(err, js) {
      if (err) {throw err;}
      sendResponse(request,response,js,'text/javascript');
    });
  }

  else if (requestURL[1] === "scripts" && request.method === "GET"){ //Fix This line
    var file = requestURL[2];
    fs.readFile('../chatClient/scripts/'+file, function(err, js) {
      if (err) {throw err;}
      sendResponse(request,response,js,'text/javascript');
    });
  }

  else if (requestURL[1] === "styles" && request.method === "GET"){ //Fix This line
    var file = requestURL[2];
    fs.readFile('../chatClient/styles/'+file, function(err, css) {
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
