
var MessageListView=Backbone.View.extend({

  className: 'messageList',

  intialize: function(){
    this.collection.on('add', function() {
      this.render();
    },this);
  },

  render: function(){
    this.collection.each(function(message){
      this.$el.append(new MessageView({model: message}).render());
    });
    $('.messageList').html(this.$el);
  }
});
