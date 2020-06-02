var Backbone = require("backbone");

var TaskModel = Backbone.Model.extend({
  url: function () {
    if (this.id) {
      return "http://localhost:3000/tasks/" + this.id;
    } else {
      return "http://localhost:3000/tasks";
    }
  },

  initialize: function () {},
});

export default TaskModel;