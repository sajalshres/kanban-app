var Backbone = require('backbone');
var Marionette = require('backbone.marionette');

var taskView = Marionette.LayoutView.extend({  
   
    tagName:'div',
  //   attributes: function () {
  //     return {
  //         id: "someth",
  //         class: "each-task",
  //         draggable:true
  //     }
  // },
    template: require('../templates/todoitem.html') // 4
  });

 module.exports = taskView;

