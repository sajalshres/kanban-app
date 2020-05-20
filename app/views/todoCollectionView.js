var Marionete = require('backbone.marionette');
var collection = require('../collections/collection');
var model = require('../models/model')
var Backbone = require('backbone');
var $ = require('jquery');
var _ = require('underscore');


var tasks = new collection.Tasks();
var TodoView = Marionete.LayoutView.extend({
    events: {
        "click .remove": "onClickRemove",
        "click .edit": "onClickEdit",
        "input .editTask": "syncer",
        "click .cancel": "onClickCancel",
        "click .editText": "editTask",
    },
    insert: function () {
        console.log('submit done')
    },
    syncer: function () {
        this.myPublic = document.getElementById("editor").value
        document.getElementById("edit").style.visibility = "visible";
        alert('ok');
    },

    onClickRemove: function (e) {
        console.log('submit done')
        e.stopPropagation();
        tasks.remove(this.model);
        this.model.destroy();
    },
    onClickEdit: function (e) {
        e.stopPropagation();
        var template = _.template($("#editTemplate").html());
        var html = template(this.model.toJSON());
        this.$el.html(html);
        document.getElementById("edit").style.visibility = "hidden";

    },
    editTask: function (event) {
        event.stopPropagation();
        console.log("editTask clicked")
        this.model.set("title", this.myPublic);
        this.model.save(null, {
            success: function () {
                console.log("edit success");
                tasks.fetch();
            },
            error: function () {
                console.log("server down")
            }
        })
    },
    onClickCancel: function (event) {
        event.stopPropagation();
        console.log("cancel clicked")
        this.render();
    },


    tagName: "div",
    attributes: function () {
        return {
            id: this.model.get('title'),
            class: "each-task",


        }
    },
    initialize: function () {
        this.model.on("change", this.render, this);
        this.id = this.model.toJSON().title;


    },
    render: function (option) {
        var tempArray = option.tempArray
        var pointer = this;
        var template = _.template($("#todoTemplate").html());
        var html = template(this.model.toJSON());
        this.$el.html(html);
        var self = $(`<div class="custom-menu"> </div>`);
        self.append(`<button class="remove">remove</button>`);
        self.append(`<button class="remove">remove</button>`);

        $.each(tempArray, function (index, value) {
            if (pointer.model.get("status") != value) {
                self.append(`<button class ="move" > ${value} </button>`)
            }
        });
        this.$el.append(self)
        return this;
    }
});

module.exports = TodoView;


