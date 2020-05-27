var Backbone = require("backbone");
var Marionette = require("backbone.marionette");
var TimeStamp = require("./services/timeNow");
var TaskCollection = require("./collections/tasks");
var ColumnCollection = require("./collections/columns");
var Task = require("./models/task");
var $ = require("jquery");

console.log(TimeStamp());

var columnCollection = new ColumnCollection();
var taskCollection = new TaskCollection();
var bufferTaskCollection = new TaskCollection();
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
  events: {
    "click ": "onClickAdd",
  },
  onClickAdd: function () {
    console.log("clicked");
  },
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
  events: {
    "click #addTask": "onClickAdd",
    "input #newTask": "syncer",
  },

  onClickAdd: function (event) {
    event.stopPropagation();
    var self = this;
    new Task({
      name: this.inputVal,
      visible: true,
      created_at: TimeStamp(),
      modified_at: "",
    }).save(null, {
      success: () => {
        bufferTaskCollection.fetch({
          success: () => {
            let obj = bufferTaskCollection.pop();
            self.collection.unshift(obj);
            let buff_array = self.model.get("items");
            buff_array.unshift(obj.id);
            self.model.set("items", buff_array);
            self.model.set("modified_at", TimeStamp())
            self.model.save(null, {
              success: () => {},
              error: () => {},
            });
          },
          error: () => {},
        });
      },
      error: () => {},
    });
    self.$("#newTask").val('');
  },

  syncer: function (event) {
    this.inputVal = this.$("#newTask").val();
    console.log(this.inputVal);
  },

  template: require("./templates/column.html"),
  childView: element_container,
  childViewContainer: "div#element",
  initialize: function () {
    console.log(this);
    this.inputVal = "";
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
  intitialize: function () {
    // this.collection.on("change", this.render, this)
  },
});
