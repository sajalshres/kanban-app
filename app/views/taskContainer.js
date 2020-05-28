var Marionette = require("backbone.marionette");
var variables = require("../services/variables");
var $ = require("jquery");
var _ = require("underscore");
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
    "click #move": "mover"
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
    console.log(options.parent.get("name"));
    this.$el.on('input', '#opt', function (){
        //  if(this.val === "")
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
