var Marionette = require("backbone.marionette");
var variables = require("../services/variables");
var $ = require("jquery");
var _ = require("underscore");
var TimeStamp = require("../services/timeNow")
var menuOpen =false;
var taskContainer = Marionette.LayoutView.extend({
  tagName: "div",
  attributes: function () {
    return {
      id: this.model.get("name"),
      class: "each-task",
      draggable: true,
    };
  },

  ui: {
    menu: "#menu-element",
  },

  events: {
    "click #opt": "tempLoader",
    "click #move": "mover",
    "input #taskChanger": "syncer",
    "click #editConform": "editSubmit",
    "click #editCancel": "canceler",
    "click #editTask": 'editTask',
    "click #removeTask": 'removeTask',
    "click #task-action": "displayMenu",

  },

  canceler:function(){
    this.render()
  },

  editSubmit:function(){
    var self = this;
    this.model.set("name", this.myEditValue);
    this.model.set("modified_at", TimeStamp());
    this.model.save(null, {
      success:function(){self.render()},
      error:function(){}
    })

  },

  syncer: function(e){
    this.myEditValue = this.$('#taskChanger').val();
    console.log(this.myEditValue);
    if((this.myEditValue === this.model.get("name")) || this.myEditValue === "" ){
      this.$('#editConform').prop("disabled", true);
    }else{
      this.$('#editConform').prop("disabled", false);
    }
  },

  tempLoader:function(e){
    e.stopPropagation();
  },

  mover: function(e){
    e.stopPropagation();
    console.log(this.$("#move").val());
  },
  editTask: function() {
    this.toggleMenu();
    this.$("#task").html(`
    <div id="edit-button">
    <input id="taskChanger" value="${this.model.get("name")}">
    <div id = "button-container"> 
        <button class="btn btn-confirm" id="editConform">Confirm</button>
        <button class="btn btn-cancel" id="editCancel">Cancel</button>
    </div>
           </div>`)
           this.$('#editConform').prop("disabled", true);
        

  },
  removeTask: function(){
    this.toggleMenu();
    console.log(this.model);
    var {parent} = this.myBuffer
    var tempArray = parent.get("items");
    tempArray.splice(tempArray.indexOf(this.model.get("id")),1);
      parent.set("items", tempArray);
      parent.set("modified_at", TimeStamp());
      parent.save(null, {
        success:function(){
          this.model.destroy();
        },
        error:function(){

        }
      })
   
  },



  template: require("../templates/element.html"),

  initialize: function (options) {
    this.myBuffer = options;
    this.myEditValue = "";
    
  },
  toggleMenu :function ()   {

    $('#menu-element').css({
        "display":"none"
    }) 
    menuOpen =!menuOpen;

    this.$('#menu-element').css({
        display: function(){
            if (menuOpen){
                return 'block';
            }
            else {
                return 'none';
            }
        }
    });
  
  },
  displayMenu: function(e) {
    e.preventDefault();
    const origin = {
        left: e.clientX,
        top: e.clientY
      };
    var id = this.model.get("name");
    this.setPosition(origin,id);
      return false;
  

},

setPosition: function ({ top, left },id)  {
    this.$('#menu-element').css({'left':`${left}px`,
   'top': `${top+5}px`});
   console.log("position")
    this.toggleMenu();
  },

removeColumn:function (){
    this.collection.remove(this.model);
    this.model.destroy();
    this.toggleMenu();
   
},

  onRender:function(){
    var pointer = this;
    
    console.log(variables.columnCollection);
    for (var i = 0; i < variables.columnCollection.length; i++) {
      if (variables.columnCollection.at(i).get("id") != pointer.myBuffer.parent.get("id")) {
        pointer.$('#opt').append(`<option id="move" class="menu-option" value="${variables.columnCollection.at(i).get("id")}">${variables.columnCollection.at(i).get("name")}</option>`);
      }
    }
  }
});

module.exports = taskContainer;
