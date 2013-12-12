var MessageList= Backbone.Collection.extend({
  model: Message,
  url: 'http://127.0.0.1:8080/classes'
});