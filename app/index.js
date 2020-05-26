var Backbone = require("backbone");
var Marionette = require("backbone.marionette");
var TimeStamp = require("./services/timeNow");
var TaskCollection = require("./collections/tasks");
var ColumnCollection = require("./collections/columns");
var $ = require('jquery')

console.log(TimeStamp());

var columnCollection = new ColumnCollection();
var taskCollection = new TaskCollection();
columnCollection.fetch({
  success: () => {
    taskCollection.fetch({
      success: () => {
        // console.log(taskCollection);
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

var columnview = Marionette.LayoutView.extend({
  tagName: "div",

  attributes: function () {
    return {
      id: "element",
    };
  },
  template: require("./templates/todotitle.html"),
  initialize: function () {
    new Column_Container({
      collection: taskCollection,
    }).render();
  },
});

var elementView = Marionette.LayoutView.extend({
  tagName: "div",
  template: require("./templates/todotitle.html"),
  initialize: function () {},
});

var Column_Container = Marionette.CompositeView.extend({
  el: "#element",
  template: require("./templates/layout.html"),
  childView: elementView,
  // childViewContainer: "div",
  initialize: function () {
    // console.log(this)
  },
});

var Main_container = Marionette.CompositeView.extend({
  el: "#app-hook",
  template: require("./templates/todolist.html"),
  childView: columnview,
  childViewContainer: "div",
  initialize: function () {
    console.log(this);
  },
});
