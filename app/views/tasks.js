var  Marionette  = require('backbone.marionette');
var taskView = require('./task');

var tasksView = Marionette.CompositeView.extend({

    el:"#app-hook",
    attributes: function (){
        return {
            id:"hello",
        }
    },

    template: require('../templates/todolist.html'),
    childView:taskView,
    childViewContainer:'div',
});

module.exports = tasksView;

