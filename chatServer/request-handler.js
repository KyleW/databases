
//NODE MODULES
var url = require('url');
var fs = require('fs');
var mysql = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  database : 'chat'
});

// connection.end();
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


var holder={};



var sendResponse = function(request,response,sendMe,contentType,status) {
  status = status || 200;
  contentType = contentType || 'text/html';
  response.writeHeader(status,{'Content-Type': contentType});
  // response.write();
  response.end(sendMe);
  connection.end();
};


////////////////////////////////////////////////////////////////////////////////////

var getUserid = function (newMessage) {
  connection.query("SELECT user_id from users WHERE username='" + newMessage.username + "'", function (err, rows, fields) {
    if (err) throw err;
    if (rows[0]){
      newMessage.user_id = rows[0].user_id;
      // console.log("existing user id is: ",user);
      getRoomid(newMessage);
    } else {
      connection.query("INSERT into users (username) values ('" + newMessage.username + "')", function (err,result) {
        if (err) throw err;
        newMessage.user_id = result.insertId;
        // console.log("new user id is: ",user);
        getRoomid(newMessage);
      });
    }
  });
};

var getRoomid = function (newMessage){
  connection.query("SELECT room_id from rooms WHERE roomname='" + newMessage.roomname + "'", function (err, rows, fields) {
    if (err) throw err;
    if (rows[0]){
      newMessage.room_id = rows[0].room_id;
      insertMessage(newMessage);
    } else {
      connection.query("INSERT into rooms (roomname) values ('" + newMessage.roomname + "')", function (err, result) {
        if (err) throw err;
        newMessage.room_id = result.insertId;
        insertMessage(newMessage);
      });
    }
  });
};

var insertMessage = function (newMessage) {
  var query = "INSERT INTO messages (room_id, user_id, text) VALUES (";
  query += newMessage.room_id + " , " + newMessage.user_id + " , ' " + newMessage.text + " ' )";

  console.log ("Here's the query we're running in mysql: ",query);

  connection.query(query, function(err, rows, fields) {
    // "INSERT into messages (text, user_id, room_id) values ('" + newMessage.text + "')", function(err, rows, fields) {
    // "INSERT into messages set ?""{user_id:}
    if (err) throw err;
    sendResponse(holder.request, holder.response, '', 'application/json', 201);
    // connection.end();
  });
};

var handleRequest = function(request, response) {
  holder.request=request;
  holder.response=response;

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
        connection.connect();
        var newMessage = JSON.parse(fullbody);

        // console.log("This is what we got from a post request ", fullbody);//debugging

        //Get user_id or create user_id
        getUserid(newMessage);

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
