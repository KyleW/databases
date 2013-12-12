
var AppView = Backbone.View.extend({
  template: _.template("<div id='heading'><h1>Chatterbox</h1> </div>\
    <div id='right'> \
      <form> \
        <span class='subtitle'>Add to the Chatter</span> \
        <textarea class='newMsg' name='userText' value=''></textarea> \
        <button class='submit' type='button'>Chatter</button> \
      </form> \
      <div id='roomLabel'> \
        <span class='subtitle'>Current Room:</span><span class='currentRoom'></span></h3> \
      </div> \
      <div id='friendLabel'> \
        <span class='subtitle'>Befriended:</span> \
        <ul id='friendList'></ul> \
      </div> \
    </div>"),

  initialize:function(){
    this.messageListView = new MessageListView({collection: this.model.get('messageList')});
    this.render();
  },
  
  render: function(){
    this.$el.html(this.template(this.model.attributes));
    this.$el.append(this.messageListView.render());
    return this.$el;

  }

});