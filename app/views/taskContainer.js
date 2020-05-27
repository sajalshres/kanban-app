
var Marionette = require('backbone.marionette');
var taskContainer = Marionette.LayoutView.extend({
    tagName: "div",
    attributes: function () {
      return {
        id:  this.model.get("name"),
        class:"each-task",
      };
    },
    template: require("../templates/element.html"),
  });
  
  module.exports = taskContainer;