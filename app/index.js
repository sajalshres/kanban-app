var Backbone = require("backbone");
var Marionette = require("backbone.marionette");
var TimeStamp = require("./services/timeNow");
var TaskCollection = require("./collections/tasks");
var ColumnCollection = require("./collections/columns");
var Main_Container = require("./views/MainContainer");
var variables = require('./services/variables')
var $ = require("jquery");

variables.columnCollection = new ColumnCollection();
variables.columnCollection.fetch({
  success: () => {
    App.start({ initialData: variables.columnCollection });
  },
  error: () => {
    alert("Server down!!");
  },
  error: () => {
    alert("Server down!!");
  },
});

var App = new Marionette.Application({
  onStart: function (options) {
    var mainContainer = new Main_Container({
      collection: options.initialData,
    });
    mainContainer.render();
  },
});
