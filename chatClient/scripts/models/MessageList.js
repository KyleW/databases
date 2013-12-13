var MessageList= Backbone.Collection.extend({

  model: Message,

  url: 'http://127.0.0.1:8080/classes',
  parse:function(response){
    _.each(response,function(item){
      var temp = new Message({});
      temp.set('text',item.text);
      app.get('messageList').add(temp);
    });
  }
});