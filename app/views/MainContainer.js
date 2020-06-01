var Marionette = require('backbone.marionette');
var column_container = require('../views/columnContainer');
var ColumnCollection = require('../collections/columns');
var ColumnModel = require('../models/column');
var variables = require('../services/variables')
var TimeStamp = require("../services/timeNow")
var $ = require('jquery');
var tempArray = [];
var columnCollection = new ColumnCollection();
var columnModel = new ColumnModel();



console.log(tempArray);
var Main_container = Marionette.CompositeView.extend({
  el: "#tree",
  template: require("../templates/container.html"),
  childView: column_container,
  childViewContainer: "div#columns",

  ui: {
    addColumn: '#new-column',
    addConfirm: "#addConfirm",
    addCancel: "#addCancel",


  },
  events: {
    'click': "removeMenu",
    'click @ui.addColumn': 'addColumn',
    'click @ui.addConfirm': 'addConfirm',
    'click @ui.addCancel': 'addCancel',
  },

  addColumn: function (event) {
    $("#newColumnText").show();
    $("#new-column").hide();
  },

  addConfirm: function (event) {
    console.log($("#columns").children().show());
    event.preventDefault();
    var inputVal = $("#colum-add-text").val();
    if (inputVal === "" || (_.contains(tempArray, inputVal))) {
      alert("no input value or either the colum is already present");

    }
    else {
      console.log(inputVal);
      columnModel = new ColumnModel({
        name: inputVal,
        items: [],
        created_at: TimeStamp(),
        modified_at: null,
      });
      columnModel.save(null, {
        success: function () {
          columnCollection.fetch({
            success:function() {
              variables.columnCollection.fetch();
            }
          });
        }

      });
      $("#newColumnText").hide();
      $("#new-column").show();
    }
  },

  removeMenu : function () {
    $('.menu').css({
      "display":"none"
    })

  },

  addCancel: function () {
    $("#newColumnText").hide();
    $("#new-column").show();
  },
  initialize: function () {
    columnCollection.fetch({
      success: function () {
        for (var i = 0; i < columnCollection.length; i++) {
          tempArray.push(columnCollection.at(i).get("name"))
        }
        console.log(tempArray);
      }
    });
  }

});

module.exports = Main_container;