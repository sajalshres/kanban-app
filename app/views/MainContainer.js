var Marionette = require('backbone.marionette');
var column_container = require('../views/columnContainer');

var Main_container = Marionette.CompositeView.extend({
    el: "#tree",
    template: require("../templates/container.html"),
    childView: column_container,
    childViewContainer: "div#columns",
   
  });

  module.exports = Main_container;