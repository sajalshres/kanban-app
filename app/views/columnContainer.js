var Marionette = require("backbone.marionette");
var taskContainer = require("./taskContainer");
var TaskCollection = require("../collections/tasks");
var Task = require("../models/task");
var TimeStamp = require("../services/timeNow");
var variables = require("../services/variables");
var $ = require("jquery");

variables.taskCollection = new TaskCollection();
variables.bufferTaskCollection = new TaskCollection();

variables.taskCollection.fetch({});

var column_container = Marionette.CompositeView.extend({
  tagName: "div",
  attributes: function () {
    return {
      id: this.model.get("name"),
      class: "task-container",
    };
  },

  template: require("../templates/column.html"),
  ui: {
    menu: "#menu-title",
    remove: "#remove",
    add: "#add",
    edit: "#edit",
    load: "#addTask",
    cancel: "#cancelAdd",
    inputVal: "#newTask",
    editVal: "#editTask",
    conform: "#editTaskConform",
  },
  events: {
    "contextmenu @ui.menu": "displayMenu",
    "click @ui.remove": "removeColumn",
    "click @ui.add": "addTask",
    "click @ui.cancel": "cancelLoad",
    "input @ui.inputVal": "syncer",
    "click @ui.load": "loadTask",
    "click @ui.edit": "editor",
    "input @ui.editVal": "editSyncer",
    "click @ui.conform": "conformEdit",
    "click #cancelLoad": "cancelLoad",
  },

  removeColumn() {
    this.model.destroy({
      success: function () {
        console.log("remove succesful");
      },
      error: function () {},
    });
  },

  editor: function () {
    console.log("edit clicked");
    this.$("#header").html(`<input type="text" id="editTask" value="">
    <button id="editTaskConform">edit</button>
    <button id="cancelAdd">Cancel</button>`);
    this.$("#editTask").val(this.model.get("name"));
    this.$("#editTaskConform").prop("disabled", true);
  },

  syncer: function () {
    this.inputValue = this.$("#newTask").val();
    console.log(this.inputValue);
  },

  editSyncer: function () {
    this.editValue = this.$("#editTask").val();
    if (this.editValue === this.model.get("name") || this.editValue === "") {
      this.$("#editTaskConform").prop("disabled", true);
    } else {
      this.$("#editTaskConform").prop("disabled", false);
    }
  },

  conformEdit: function (e) {
    e.stopPropagation();
    var self = this;
    this.model.set("name", this.editValue);
    this.model.set("modified_at", TimeStamp());
    this.model.save(null, {
      success: () => {
        self.render();
      },
      error: () => {},
    });
  },

  cancelLoad: function (e) {
    e.stopPropagation();
    this.render();
  },

  loadTask: function (e) {
    e.stopPropagation();
    var self = this;
    new Task({
      name: this.inputValue,
      visible: true,
      created_at: TimeStamp(),
      modified_at: "",
    }).save(null, {
      success: () => {
        variables.bufferTaskCollection.fetch({
          success: () => {
            let obj = variables.bufferTaskCollection.pop();
            self.collection.unshift(obj);
            let buff_array = self.model.get("items");
            buff_array.unshift(obj.id);
            self.model.set("items", buff_array);
            self.model.set("modified_at", TimeStamp());
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
    self.$("#newTask").val("");
    self.render();
  },

  addTask: function (e) {
    e.stopPropagation();
    console.log("wow");
    this.$("#header").html(`<input type="text" id="newTask" value="">
    <button id="addTask">Add</button>
    <button id="cancelAdd">Cancel</button>`);
  },

  displayMenu: function (e) {
    e.preventDefault();
    e.stopPropagation();
    const origin = {
      left: e.clientX,
      top: e.clientY,
    };
    var id = e.target.id;
    console.log(id);
    var sel = "#" + id;
    this.$("#header").append(`<div class="menu">
       <ul class="menu-options">
         <li id ="add" class="menu-option">add</li>
         <li id="remove" class="menu-option">remove</li>
         <li id ="edit" class="menu-option">edit</li>
         <li id = "cancelLoad" class="menu-option">Cancel</li>
       </ul>
        </div>`);
    this.setPosition(origin);
    return false;
  },

  toggleMenu: function (command) {
    this.$(".menu").css({ display: "block" });
  },

  setPosition: function ({ top, left }) {
    this.$(".menu").css({ left: `${left}px`, top: `${top + 10}px` });
    console.log(top, left);
    this.toggleMenu("show");
  },

  // removeColumn: function () {
  //   alert("remove function called");
  // },

  childView: taskContainer,

  childViewContainer: "div#element",

  initialize: function () {
    this.inputValue = "";
    this.editValue = "";
    var items = this.model.get("items");
    console.log(items);
    var item_object = new Array();
    for (id of items) {
      item_object.push(variables.taskCollection.get(id));
    }
    console.log(item_object);
    this.collection = new Backbone.Collection(item_object);
  },

  childViewOptions: function(model, index) {
    return {
      parent: this.model
    }
}}
);

module.exports = column_container;
