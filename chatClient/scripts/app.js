$(document).ready(function(){

  getMessages();

  $('.currentRoom').text(currentRoom);
  $('button').on('click', function(){
    var userMessage = $('.newMsg').val().toString();
    sendMessage(userMessage);
  });


//Clicking on username
  $('#left').on('click','.username',function(){
    befriended.push($(this).text());
    // $('.userFocus').text(userFocus);
    $('#friendList').append('<li><a href="#"</a></li>').text(userFocus);
    $friendUser = $( "div.username:contains("+ userFocus +") ").addClass('friend');
    $friendUser.siblings('.text').addClass('friend');
  });

//Clicking on Room Name
  $('.container').on('click','.roomname',function(){
    currentRoom = $(this).text();
    $('.currentRoom').text(currentRoom);
    $rooms = $( "div.roomname:contains("+ currentRoom +") ").parent().addClass('keep');
    $('.message').not('.keep').fadeOut();
    console.log($rooms);
  });
});



//GLOBALS

var userName=''; // grab this from the prompt
var befriended= [];
var currentRoom = 'Lobby';
var listOfMessages = [];
var mostRecentUpdate = '';
var characterLimits = {
  'objectId': 24,
  'roomname': 30,
  'text':140,
  'updatedAt': 24,
  'username': 50
};

var messageFields = [
  'username',
  'roomname',
  'text',
  'createdAt',
  'updatedAt',
  'objectId'
];

// HELPER FUNCTIONS


//RETRIEVING MESSAGES

var getMessages = function(){
  console.log('getting messages');
  $.ajax({
    // url: 'https://api.parse.com/1/classes/chatterbox',
    url: 'http://127.0.0.1:8080/classes',
    type: 'GET',
    // contentType: 'application/json',
    // contentType: 'text/plain',
    // crossDomain:true,
    // data: {"order" :"-createdAt"},
    // {"where": {
    //       "objectId":"teDOY3Rnpe"
    //       // "order":"-createdAt"
    //     }
    //   },
    success: function (data) {
      // data = JSON.parse(data);
      console.log(data);
      listOfMessages = [];
      _.each(data.messages, function(messageJSON){
        renderMessage(messageJSON);
      });
      printMessages(listOfMessages);
    },
    error: function (a,b,c) {
      // console.log(a,b,c);
      // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to get message. Will try again in 2sec');
    }
  });
};



// SUBMITTING MESSAGES
var composeMessage = function(userText) {
  var sendJSON = {};
  userName = window.location.search;
  userName = userName.split('=')[1];
  sendJSON.username = userName;
  sendJSON.text = userText;
  sendJSON.roomname = currentRoom;
  return sendJSON;
};

var sendMessage = function(input) {
  var toSend = composeMessage(input);
  $.ajax({
    url: 'http://127.0.0.1:8080/classes',
    // url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'POST',
    data: JSON.stringify(toSend),
    success: function (data) {
      console.log('chatterbox: Message sent');
      $('.newMsg').val("  ");
      getMessages();
    },
    error: function (data) {
      // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.log(data);
      console.log('Chatterbox failed to send message. Please Try Again.');
    }
  });
};



// Displaying messages

var renderMessage = function(messageJSON){
  var $messageNode = $('<div></div>');
  $messageNode.addClass('message');
  _.each(messageFields, function(val, i) {
    var content = messageJSON[messageFields[i]];
    if(content){
      content = content.slice(0,characterLimits[messageFields[i]]);
      if (val.charCodeAt(0) > 150) return;
    }
    $('<div></div>')
      .addClass(messageFields[i])
      .text(content)
      .appendTo($messageNode);

  });
  listOfMessages.push($messageNode);
};

var printMessages = function(listOfMessages){
  $('.message').remove();
  _.each(listOfMessages, function(msgNode, i) {
      $('#left').append(msgNode);
  });
};
