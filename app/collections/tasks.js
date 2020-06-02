import Backbone from 'backbone';
var task = require("../models/task");

var TaskCollection = Backbone.Collection.extend({
  url: "http://localhost:3000/tasks",
  model: task,
  initialize: function () {},
});

export default TaskCollection;
