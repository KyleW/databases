var MessageView = Backbone.View.extend({
    template:_.template("<div class='message'>\
      <div class='username'><%=username%></div>\
      <div class='roomname'><%=roomname%></div>\
      <div class='text'><%=text%></div>\
      <div class='createdAt'><%=createdAt%></div>\
    </div>"),

  render: function(){
   
  }
});