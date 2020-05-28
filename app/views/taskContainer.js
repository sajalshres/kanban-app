var Marionette = require("backbone.marionette");
var variables = require("../services/variables");
var $ = require("jquery");
var _ = require("underscore");
var TimeStamp = require("../services/timeNow")
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
    "click #editCancel": "canceler"
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

  template: require("../templates/element.html"),

  initialize: function (options) {
    this.myBuffer = options;
    this.myEditValue = "";
    console.log(options.parent.get("name"));
    var self = this;
    this.$el.on('input', '#opt', function (){
         if(this.value === "edit"){
           console.log(this.value)
           self.$("#task").html(`<input id="taskChanger" value="${self.model.get("name")}">
           <button id="editConform">edit</button>
           <button id="editCancel">cancel</button>`)
           self.$('#editConform').prop("disabled", true);
         }else if(this.value === "remove"){
          console.log(this.value)
           var tempArray = options.parent.get("items");
           tempArray.splice(tempArray.indexOf(self.model.get("id")),1);
              options.parent.set("items", tempArray);
              options.parent.set("modified_at", TimeStamp());
              options.parent.save(null, {
                success:function(){
                  self.model.destroy();
                },
                error:function(){

                }
              })
         }else{

         }
    })
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
