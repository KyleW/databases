  var messageList =  new MessageList();
  var app = new App({messageList: messageList});
  var appView = new AppView({model:app});
  messageList.fetch();




$(document).ready(function(){
  $('body').html(appView.render());
  setInterval(function() {
    messageList.fetch();
  },  10000);
});

