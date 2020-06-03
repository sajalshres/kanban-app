var Marionette = require("backbone.marionette");
var  taskContainer = require("./taskContainer") ;
var TaskCollection = require("../collections/tasks");
var  ColumnCollection = require("../collections/columns");
var  Task = require("../models/task");
var TimeStamp = require("../services/timeNow");
var variables = require("../services/variables");
var $ = require("jquery");
var _ = require("underscore")
var menuOpen = false;
var tempArray = [];


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
    "click @ui.menu": "displayMenu",
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
    "click #cancel-add":"canceler",
  },

  canceler:function () {
    this.render();
  },
  dragover: function (event) {
    event.preventDefault();
  },
  dragstart: function (event) {
    // var id = event.target.id;
    // sel = "#" + id;
    // $(sel).css({
    //   "border": "2px solid black",
    // })
    // mySource = event.target.id;
    // sourceId = this.model.get("items");
    // draggedItem = this.model;
    // variables.taskCollection.each((target) => {
    //   if (target.get("name") === mySource) {
    //     draggedItemId = target.get("id");
    //   }
    // })


  },
  draggable: function (event) {
    variables.mySourceId = event.target.id;
    variables.mySourceModel = this.model;
  },
  dropper: function (event) {
    this.myTarget = event.target.id;
    let titleArray = new Array();

    variables.columnCollection.each((model)=>{
      titleArray.push(model.get("name"));
    })
    if(_.contains(titleArray, this.myTarget)){
      var tempModel;
      variables.taskCollection.each((model)=>{
        if(model.get("id") == variables.mySourceId){
          tempModel = model;
        }
      })
      let tempArray = variables.mySourceModel.get("items");
      tempArray.splice(tempArray.indexOf(tempModel.get("id")),1);
      variables.mySourceModel.set("items", tempArray);
      tempArray = this.model.get("items");
      tempArray.unshift(tempModel.get("id"));
      this.model.set("items", tempArray);
      variables.mySourceModel.save(null, {
        success: ()=>{
          this.model.save(null, {
            success: ()=>{
              variables.columnCollection.reset(null);
              variables.columnCollection.fetch();
            },
            error:()=>{

            }
          })
        },
        error: ()=>{

        }
      })
    }
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
        <button class="btn btn-cancel" id="cancelAdd">Cancel</button>
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
    this.toggleMenu();
    e.stopPropagation();
    console.log("wow");
    this.$("#header").html(`<div id ="edit-button"> <input type="text" id="newTask" value="">
    <div id="button-container">
    <button class="btn btn-confirm" id="addTask">Add</button>
    <button class="btn btn-cancel" id="cancelAdd">Cancel</button>
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
    this.myTarget = "";
    var items = this.model.get("items");
    console.log(items);
    var item_object = new Array();
    for (var id of items) {
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
