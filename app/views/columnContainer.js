
var Marionette = require('backbone.marionette');
var taskContainer =require('./taskContainer');
var TaskCollection = require("../collections/tasks");
var $ = require('jquery');


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
    ui: {
        menu: '#menu-title',
        remove: '#remove'

    },
    events: {
        'contextmenu @ui.menu': 'displayMenu',
        'click @ui.remove': 'removeColumn'
      },
    
    displayMenu: function(e) {
        e.preventDefault();
        const origin = {
            left: e.clientX,
            top: e.clientY
          };
        var id = e.target.id;
        console.log(id);
        var sel="#"+id;
       $("#header").append(`<div class="menu">
       <ul class="menu-options">
         <li id="remove" class="menu-option">remove</li>
         <li id ="edit" class="menu-option">edit</li>
         <li id ="hide" class="menu-option">hide</li>
       </ul>
        </div>`);
        this.setPosition(origin);
          return false;
      

    },
    toggleMenu :function (command)   {
        $('.menu').css({'display':'block'})
      },

    setPosition: function ({ top, left })  {
        $('.menu').css({'left':`${left}px`,
       'top': `${top+10}px`});
       console.log(top,left);
        this.toggleMenu('show');
      },
    
    remove:function (){
        alert('remove function called');
    },
   

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