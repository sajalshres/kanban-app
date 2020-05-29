var Marionette = require("backbone.marionette");
var taskContainer = require("./taskContainer");
var TaskCollection = require("../collections/tasks");
var ColumnCollection = require("../collections/columns");
var Task = require("../models/task");
var TimeStamp = require("../services/timeNow");
var variables = require("../services/variables");
var $ = require("jquery");
var menuOpen = false;
var tempArray = [];
var mySource;
var sourceId;
var draggedItemId;
var draggedItem;

variables.taskCollection = new TaskCollection();
variables.bufferTaskCollection = new TaskCollection();
variables.columnCollection = new ColumnCollection();

variables.taskCollection.fetch({});

variables.taskCollection.fetch({
  success: function () {
    for (var i = 0; i < variables.taskCollection.length; i++) {
      tempArray.push(variables.taskCollection.at(i).get("name"))

    }
  }
});

console.log(tempArray);

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
    "drag .each-task": "draggable",
    "drop": "dropper",
    "dragstart .each-task": "dragstart",
    "dragover": "dragover",
    "click #new-column": "addColumn",
  },

  dragover: function (event) {
    event.preventDefault();
    var id = event.target.id;

  },
  dragstart: function (event) {
    var id = event.target.id;
    sel = "#" + id;
    $(sel).css({
      "border": "2px solid black",

    })
    mySource = event.target.id;
    sourceId = this.model.get("items");
    draggedItem = this.model;
    variables.taskCollection.each((target) => {
      if (target.get("name") === mySource) {
        draggedItemId = target.get("id");
      }
    })
  },
  draggable: function (event) {

  },
  dropper: function (event) {
    var self = this;
    this.myTarget = event.target.id;
    console.log(mySource);
    variables.taskCollection.each((target) => {
      if (target.get("name") === mySource) {
        console.log(target);
        obj = target;
        let buff_array = self.model.get("items");
        buff_array.unshift(obj.id);
        self.model.set("items", buff_array);
        self.model.set("modified_at", TimeStamp());
        const index = sourceId.indexOf(draggedItemId);
        sourceId.splice(index, 1);
        variables.taskCollection.add(draggedItem);
        draggedItem.save();
        self.model.save(null, {
          success: () => {
            variables.columnCollection.fetch({
              success: function () {
                variables.taskCollection.fetch({
                  success: function () {
                    this.reder();

                  }
                });
              }
            });
          },
          error: () => {
          }
        })
      }
    })
  },
  addColumn: function () {
    alert("new column added");

  },
  removeColumn() {
    this.toggleMenu();
    this.model.destroy({
      success: function () {
        console.log("remove succesful");
      },
      error: function () { },
    });
  },

  editor: function () {
    this.toggleMenu();
    this.$("#header").html(`<div id="edit-button">
    <input id="editTask" value="${this.model.get("name")}">
    <div id = "button-container"> 
        <button class="btn btn-confirm" id="editTaskConform">Confirm</button>
        <button class="btn btn-cancel" id="CancelAdd">Cancel</button>
    </div>
           </div>`);
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
      error: () => { },
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
        console.log(variables.bufferTaskCollection);
        variables.bufferTaskCollection.fetch({
          success: () => {
            let obj = variables.bufferTaskCollection.pop();
            self.collection.unshift(obj);
            let buff_array = self.model.get("items");
            buff_array.unshift(obj.id);
            self.model.set("items", buff_array);
            self.model.set("modified_at", TimeStamp());
            self.model.save(null, {
              success: () => { },
              error: () => { },
            });
          },
          error: () => { },
        });
      },
      error: () => { },
    });
    self.$("#newTask").val("");
    self.render();
  },

  addTask: function (e) {
    e.stopPropagation();
    console.log("wow");
    this.$("#header").html(`<div id ="edit-button"> <input type="text" id="newTask" value="">
    <div id="button-container">
    <button id="addTask">Add</button>
    <button id="cancelAdd">Cancel</button>
    </div>
    </div>`);
  },

  toggleMenu: function (id) {
    $('.menu').css({
      "display": "none"
    })
    menuOpen = !menuOpen;

    this.$('.menu').css({
      display: function () {
        if (menuOpen) {
          return 'block';
        }
        else {
          return 'none';
        }
      }
    });

  },
  displayMenu: function (e) {
    e.preventDefault();
    const origin = {
      left: e.clientX,
      top: e.clientY
    };
    var id = this.model.get("name");
    console.log(id);
    this.setPosition(origin, id);
    return false;


  },

  setPosition: function ({ top, left }, id) {
    this.$('.menu').css({
      'left': `${left}px`,
      'top': `${top + 10}px`
    });
    console.log(top, left);
    this.toggleMenu(id);
  },



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

  childViewOptions: function (model, index) {
    return {
      parent: this.model
    }
  }
}
);

module.exports = column_container;
