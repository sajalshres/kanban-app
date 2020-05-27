var Backbone = require("backbone");
var Marionette = require("backbone.marionette");
var TimeStamp = require("./services/timeNow");
var TaskCollection = require("./collections/tasks");
var ColumnCollection = require("./collections/columns");
var $ = require("jquery");
var Main_Container = require('./views/MainContainer');
var columnCollection = new ColumnCollection();


columnCollection.fetch({
  success: () => {
      
        console.log(columnCollection);
        App.start({initialData: columnCollection});
      },
      error: () => {
        alert("Server down!!");
      },
  error: () => {
    alert("Server down!!");
  },
});

var App = new Marionette.Application({
  onStart: function(options) {
    var mainContainer = new Main_Container({
      collection: options.initialData,
      
    });
    mainContainer.render();
    
  }
});




