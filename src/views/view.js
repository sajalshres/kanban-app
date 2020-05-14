var Backbone = require('backbone');
var Models = require('./../models/model')

var Views = {
    "Todo" : Backbone.View.extend({
        tagName: "li",
        render: function(){
            this.$el.html(this.model.get("title"));
            return this
        }
    }),

    "Todos" : Backbone.View.extend({
        render: function(){
            var self = this;
            this.model.each(function(task){
                var todoView = new Views.Todo({model: task});
                self.$el.append(todoView.render().$el)
            })
        }
    })
}

module.exports = Views;