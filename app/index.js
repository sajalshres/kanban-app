
var TaskCollection = require('./collections/tasks');
var TaskModel = require('./models/task');
var Marionette = require('backbone.marionette');
var TasksView = require('./views/tasks');
var tasks = new TaskCollection();


tasks.fetch({
  success: function(data,response)  {
  App.start({initialData: response});
 },

})

 
var App = new Marionette.Application({
  onStart: function(options) {
    var tasksView = new TasksView({
      collection: new Backbone.Collection(options.initialData),
      model: new TaskModel(),
      
    });
    tasksView.render();
    
  }
});




