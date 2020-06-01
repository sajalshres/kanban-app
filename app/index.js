
import  Marionette from "backbone.marionette";
import TimeStamp from "./services/timeNow";
var TaskCollection = require("./collections/tasks");
var ColumnCollection = require("./collections/columns");
var Main_Container = require("./views/MainContainer");
var variables = require('./services/variables')
var $ = require("jquery");
var tempArray = [];

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

variables.taskCollection.fetch({
  success:  ()=>  {
      for (var i = 0; i < variables.taskCollection.length; i++) {
          if (!(_.contains(tempArray,  variables.taskCollection.at(i).get("name")))) {
              tempArray.push(variables.taskCollection.at(i).get("name"))
          }
      }
    }
});


var App = new Marionette.Application({
  onStart: (options) =>{
    var mainContainer = new Main_Container({
      collection: options.initialData,
    });
    mainContainer.render();
  },
});
