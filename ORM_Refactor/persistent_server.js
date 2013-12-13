//NODE MODULES
var url = require('url');
var fs = require('fs');
// var mysql = require('mysql');
var Sequelize = require("sequelize");


var sequelize = new Sequelize("chatterbox", "root", null, {
  dialect: 'mysql',
  port: 3306
});

sequelize
  .authenticate()
  .complete(function(err) {
    if (!!err) {
      console.log('Unable to connect to the database.');
    } else {
      console.log('Connection has been established successfully.');
    }
  });


/* first define the data structure by giving property names and datatypes
 * See http://sequelizejs.com for other datatypes you can use besides STRING. */
var User = sequelize.define('User', {
  user_name: Sequelize.STRING
});

var Message = sequelize.define('Message',{
  text: Sequelize.TEXT
});

var Room = sequelize.define('Room',{
  roomname: Sequelize.STRING
});

User.hasMany(Message);
Message.belongsTo(User);

Room.hasMany(Message);
Message.belongsTo(Room);


sequelize
  .sync({ force: true })
  .complete(function(err) {
     if (!!err) {
       console.log('An error occurred while create the table.');
     } else {
       console.log('It worked!');

      var newUsr = User.create({
        user_name:"Jean Valjean"
      });

      var newRoom = Room.create({
        roomname: "Some room"
      });

      var newMsg = Message.create({
        user_name: "Jean Valjean",
        text: "I am the very model of a modern major general.",
        roomname: "Some room"
      }).complete(function(err) {
        if (!!err) {
          console.log('The instance has not been saved.');
        } else {
          console.log('We have a persisted instance now');
        }
      });
    }
  });

//   // Retrieve objects from the database:
// User.findAll({ where: {user_name: "Jean Valjean"} }).success(function(usrs) {
//     // This function is called back with an array of matches.
//     for (var i = 0; i < usrs.length; i++) {
//       console.log(usrs[i].user_name + " exists");
//     }
//   });
// });




var sendResponse = function(request,response,sendMe,contentType,status) {
  status = status || 200;
  contentType = contentType || 'text/html';
  response.writeHeader(status,{'Content-Type': contentType});
  response.end(sendMe);
};


// ////////////////////////////////////////////////////////////////////////////////////

// var getUserid = function (newMessage) {
//   connection.query("SELECT user_id from users WHERE username='" + newMessage.username + "'", function (err, rows, fields) {
//     if (err) throw err;
//     if (rows[0]){
//       newMessage.user_id = rows[0].user_id;
//       // console.log("existing user id is: ",user);
//       getRoomid(newMessage);
//     } else {
//       connection.query("INSERT into users (username) values ('" + newMessage.username + "')", function (err,result) {
//         if (err) throw err;
//         newMessage.user_id = result.insertId;
//         // console.log("new user id is: ",user);
//         getRoomid(newMessage);
//       });
//     }
//   });
// };

// var getRoomid = function (newMessage){
//   connection.query("SELECT room_id from rooms WHERE roomname='" + newMessage.roomname + "'", function (err, rows, fields) {
//     if (err) throw err;
//     if (rows[0]){
//       newMessage.room_id = rows[0].room_id;
//       insertMessage(newMessage);
//     } else {
//       connection.query("INSERT into rooms (roomname) values ('" + newMessage.roomname + "')", function (err, result) {
//         if (err) throw err;
//         newMessage.room_id = result.insertId;
//         insertMessage(newMessage);
//       });
//     }
//   });
// };

// var insertMessage = function (newMessage) {
//   var query = "INSERT INTO messages (room_id, user_id, text) VALUES (";
//   query += newMessage.room_id + " , " + newMessage.user_id + " , ' " + newMessage.text + " ' )";

//   console.log ("Here's the query we're running in mysql: ",query);

//   connection.query(query, function(err, rows, fields) {
//     // "INSERT into messages (text, user_id, room_id) values ('" + newMessage.text + "')", function(err, rows, fields) {
//     // "INSERT into messages set ?""{user_id:}
//     if (err) throw err;
//     sendResponse(holder.request, holder.response, '', 'application/json', 201);
//     // connection.end();
//   });
// };

var handleRequest = function(request, response) {

  // holder.request=request;
  // holder.response=response;

  var toSend = "";
  var statusCode= 404;
  var urlObject = url.parse(request.url);
  var requestURL = urlObject.pathname.split('/');

  var headers = defaultCorsHeaders;

  console.log("Serving request type " + request.method + " for url " + request.url);

  if (requestURL[1] === 'classes') {
    if (request.method === "GET") {
      Message
        .findAll()
        .complete(function(err, data) {
          if (!!err) {
            console.log('An error occurred while searching for John!');
          // } else if (!johnDoe) {
          //   console.log('No user with the username "john-doe" has been found.');
          } else {
            sendResponse(request, response, JSON.stringify(data), 'application/json');
          }
        });

      // connection.query("SELECT * from messages", function(err, rows, fields) {
      //   if (err) throw err;
      //   sendResponse(request, response, JSON.stringify(rows), 'application/json');
      //   console.log('Heres what we sent: ', rows);
      // });
    }
  }


//     if (request.method === "POST"){
//       statusCode = 201;
//       headers['Content-Type'] = 'application/json';
//       var fullbody = '';

//       request.on('data', function(chunk){
//         fullbody += chunk;
//       });

//       request.on('end', function(){
//         var newMessage = JSON.parse(fullbody);

//         // console.log("This is what we got from a post request ", fullbody);//debugging

//         //Get user_id or create user_id
//         getUserid(newMessage);

//       });
//     }
//   }


// ////////// SERVES STATIC FILES ////////////////////

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




