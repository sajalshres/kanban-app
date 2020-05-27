var Backbone = require("backbone");
var Marionette = require("backbone.marionette");
var TimeStamp = require("./services/timeNow");
var TaskCollection = require("./collections/tasks");
var ColumnCollection = require("./collections/columns");
var $ = require("jquery");

console.log(TimeStamp());

var columnCollection = new ColumnCollection();
var taskCollection = new TaskCollection();
columnCollection.fetch({
  success: () => {
    taskCollection.fetch({
      success: () => {
        console.log(taskCollection);
        console.log(columnCollection);
        new Main_container({ collection: columnCollection }).render();
      },
      error: () => {
        alert("Server down!!");
      },
    });
  },
  error: () => {
    alert("Server down!!");
  },
});

var element_container = Marionette.LayoutView.extend({
  tagName: "div",
  attributes: function () {
    return {
      id: "#" + this.model.get("name"),
    };
  },
  template: require("./templates/element.html"),
});

var column_container = Marionette.CompositeView.extend({
  tagName: "div",
  attributes: function () {
    return {
      id: this.model.get("name"),
    };
  },

  template: require("./templates/column.html"),
  childView: element_container,
  childViewContainer: "div#element",
  initialize: function () {
    var items = this.model.get("items");
    var item_object = new Array();
    for (id of items) {
      item_object.push(taskCollection.get(id));
    }
    this.collection = new Backbone.Collection(item_object);
  },
});

var Main_container = Marionette.CompositeView.extend({
  el: "#tree",
  template: require("./templates/container.html"),
  childView: column_container,
  childViewContainer: "div#columns",
});
