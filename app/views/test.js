var Backbone = require('backbone');
todoApp = Backbone.View.extend({
    el:"#tre",
    tagName: "li",
    render: function() {
      return this;
    },
    initialize: function () {
        this.render();
    },

    render: function() {
      this.$el.html("Hello TutorialsPoint!!!");
   }
  });

module.exports =  todoApp;
