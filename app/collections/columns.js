var Backbone = require('backbone');
var columnModel= require("../models/column");

var  ColumnCollection = Backbone.Collection.extend({
  url: "http://localhost:3000/columns",
  model: columnModel,
  initialize: function () {},
});

module.exports = ColumnCollection;