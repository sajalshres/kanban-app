var Backbone = require('backbone');
var Model = require('./models/model');
var Collection = require('./collections/collection')
var _ = require('underscore')
var $ = require('jquery')

var TodosView = Backbone.View.extend({
    events: {
        'change input#newTask': 'loadTask'
    },


    loadTask: function(event) {
        var val = $(event.currentTarget).val();
        var newModel = new Model.Task();
        
        newModel.set("title", val);
        newModel.set("status", "todo");
        
        newModel.save(null,{
            success:function(){
                console.log("model saved")
                tasksTodo.fetch();
            },
            error:function(){
                console.log("model saving failed")
            }
        })
      
    }
,
    initialize: function () {
        this.model.on("remove", this.render, this);
        this.model.on("add", this.render, this);
    },
    updater:function(){
        
    },
    render: function () {
        this.$el.html("");
        var template = _.template($("#inputTemplate").html());
        var html = template(this.model.toJSON());
        this.$el.html(html);
        var self = this;
        this.model.each(function (task) {
            var todoView = new TodoView({ model: task });
            self.$el.append(todoView.render().$el)
        })
    }
})

var TodoView = Backbone.View.extend({
    events: {
        "click": "onClick",
        "click .remove": "onClickRemove",
        
    },
    insert:function(){
        console.log('submit done')
    }
    ,
    onClick: function () {
        console.log("item clicked")
    },
    onClickRemove: function (e) {
        e.stopPropagation();
        console.log('btn clicked');
        tasksTodo.remove(this.model); 
        this.model.destroy();
        // this.model.set("title", "haha")
        // this.remove();
        // this.model.destroy();
        // this.model.save();
        // fetcher();
        console.log(tasksTodo)
    },
    tagName: "div",
    className: "sdfads",
    attributes: function () {
        return {
            id: this.model.get('title')
        }
    },
    initialize: function () {
        this.model.on("change", this.render, this);
        console.log('hello')
        console.log(this.model.toJSON().title)
        this.id = this.model.toJSON().title;
    },
    render: function () {
        var template = _.template($("#todoTemplate").html());
        var html = template(this.model.toJSON());
        this.$el.html(html);
        return this;
    }
})

var tasksTodo = new Collection.Tasks()

var fetcher = function(){
    tasksTodo.fetch({
        success:function(){
            (new TodosView({el: "#todo", model: tasksTodo})).render();
        },
        error:function(){
            console.log("server down");
        }
    })
}

fetcher();










// var todo = new Model.Task({title: 'github setup'});
// var todoView = new View.Todo({el:"#todo", model:todo})
// todoView.render();










