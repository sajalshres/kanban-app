var Marionete = require('backbone.marionette');
var collection = require('../collections/collection');
var Backbone = require('backbone');
var $ = require('jquery');
var _ = require('underscore');



var TodoView = Marionete.LayoutView.extend({


    tagName: "div",
    attributes: function () {
        return {
            id: this.model.get("title"),
            class:"card"
        }
    },

    initialize: function () {
        this.model.on("change", this.render, this)
        this.id = this.model.toJSON().title;
        // this.class = "card";
    },
    render: function () {
        var template = _.template($("#todoTemplate").html());;
        var html = template(this.model.toJSON());
        console.log(html);
        this.$el.html(html);
        console.log("inner render");
        return this;
    },



})

module.exports = TodoView;


