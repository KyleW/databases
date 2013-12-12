$(document).ready(function(){
  var messageList =  new MessageList(testData);
  var app = new App({messageList: messageList});
  var appView = new AppView({model:app});
  $('body').html(appView.render());
});

