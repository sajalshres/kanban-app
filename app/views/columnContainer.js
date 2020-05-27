
var Marionette = require('backbone.marionette');
var taskContainer =require('./taskContainer');
var TaskCollection = require("../collections/tasks");


var taskCollection = new TaskCollection();

taskCollection.fetch({

})

var column_container = Marionette.CompositeView.extend({
    tagName: "div",
    attributes: function () {
      return {
        id: this.model.get("name"),
        class:"task-container",
      };
    },
  
    template: require("../templates/column.html"),
    childView: taskContainer,
    childViewContainer: "div#element",
    initialize: function () {
      var items = this.model.get("items");
      console.log(items);
      var item_object = new Array();
      for (id of items) {
        item_object.push(taskCollection.get(id));
      }
      console.log(item_object);
      this.collection = new Backbone.Collection(item_object);
    },
  });
  
  module.exports = column_container;