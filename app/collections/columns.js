var Backbone = require("backbone");
var column = require("../models/column");

module.exports = Backbone.Collection.extend({
  url: "http://localhost:3000/columns",
  model: column,
  initialize: function () {},
});
