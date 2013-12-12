
var MessageListView=Backbone.View.extend({

  className: 'messageList',

  intialize: function(){
      this.collection.on('add', function() {
      this.render();
    },this);
  },

  render: function(){
    return this.$el.append(this.collection.map(function(message){
      new MessageView({model: message}).$el}));
  }
});
