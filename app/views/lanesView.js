var Marionete = require('backbone.marionette');
var Collection = require('../collections/collection');
var model = require('../models/model')
var Backbone = require('backbone');
var $ = require('jquery');
var _ = require('underscore');
var TodosView = require('./todoListView');
var tasks = new Collection.Tasks();

var lanesView = Backbone.View.extend({
    events: {
        "click .addLaneInputEnable": "onAddLane",
        "input .laneInput": "syncer",
        "click .cancel": "onCancel",
        "click .create": "onCreate"
    },
    onCreate: function () {
        event.stopPropagation();
        this.tempArray.push(this.myPublic);
        var selector = "#" + this.myPublic;
        var div = document.createElement("div");
        div.id = this.myPublic;
        div.className="card";
        $("#contain").append(div);
        (new TodosView({ el: selector, model: tasks, option: this.myPublic })).render();
        this.render();
    },
    onCancel: function (event) {
        event.stopPropagation();
        this.render()
    },
    syncer: function () {
        document.getElementById("createBtn").disabled = false;
        this.myPublic = document.getElementById("laneName").value
        console.log(this.myPublic);
        if (this.myPublic === "" || (_.contains(this.tempArray, this.myPublic))) {
            document.getElementById("createBtn").disabled = true;
        }
    },
    onAddLane: function () {
        console.log("clicked");
        var template = _.template($("#inputLaneTemplate").html());
        var html = template();
        this.$el.html(html);
        document.getElementById("createBtn").disabled = true;
    },
    initialize: function (option) {
        console.log(option);
        this.tempArray=option.tempArray;
        this.myPublic = ""
        
    },
    render: function () {
        var template = _.template($("#addLaneTemplate").html());
        var html = template();
        this.$el.html(html);
    }
})

module.exports = lanesView;