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
        "input .editTask": "syncer",
        "click .cancel": "onClickCancel",
        "click .editText": "editTask"
    },
    insert: function () {
        console.log('submit done');
    },
    syncer: function () {
        this.myPublic = document.getElementById("editor").value
        document.getElementById("edit").style.visibility = "visible";
        console.log(this.myPublic);
    },
    onClick: function (e) {
        e.stopPropagation();
        console.log("item clicked")
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
        var self = this;
        this.$el.on('input', '.custom-menu', function () {
            console.log("triggered")
            if (this.value == "remove") {
                tasks.remove(self.model);
                self.model.destroy();
            } else if (this.value == "edit") {
                var template = _.template($("#editTemplate").html());
                var html = template(self.model.toJSON());
                self.$el.html(html);
                document.getElementById("edit").style.visibility = "hidden";
            }else{
                var clone = new Model.Task();
                clone.set("title", self.model.get("title"));
                clone.set("status", this.value);
                tasks.remove(self.model);
                self.model.destroy();
                clone.save(null, {
                    success:function(){
                        console.log("moving success");
                        tasks.fetch()
                        self.render();
                    }
                })
            }
        })
        console.log(this)

        this.id = this.model.toJSON().title;
    },
    render: function (option) {
       
        console.log(tempArray);
        var pointer = this;
        var template = _.template($("#todoTemplate").html());
        var html = template(this.model.toJSON());
        this.$el.html(html);
        var self = $(`<div class="custom-menu"> </div>`);
        self.append("<option selected>..</option>");
        self.append("<option value='remove'>Remove</option>");
        self.append("<option value='edit'>Edit</option>");

        $.each(tempArray, function (index, value) {
            if (pointer.model.get("status") != value) {
                self.append("<option value='" + value + "'>" + "Move to " + value + "</option>")
            }
        });
        this.$el.append(self)
        return this;
    }
});

module.exports = TodoView;


