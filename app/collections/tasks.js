var Backbone = require("backbone");
var task = require("../models/task");

module.exports = Backbone.Collection.extend({
  url: "http://localhost:3000/tasks",
  model: task,
  initialize: function () {},
});
