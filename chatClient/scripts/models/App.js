var App = Backbone.Model.extend({
  initialize: function(){
    // this.set('messageList', new MessageList(testData));
  },

  defaults:{
    userName:'', // grab this from the prompt
    befriended:[],
    currentroom: 'Lobby',
    characterLimit: {
      'objectId': 4,
      'roomname': 30,
      'text':140,
      'updatedAt': 24,
      'username': 50
    }
  }
});