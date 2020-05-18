var Backbone = require('backbone');
var Model = require('./models/model');
var Collection = require('./collections/collection')
var _ = require('underscore')
var $ = require('jquery')

var TodosView = Backbone.View.extend({
    events: {
        'change input#newTask': 'loadTask'
    },
    loadTask: function (event) {
        var val = $(event.currentTarget).val();
        var newModel = new Model.Task();
        var self = this;
        newModel.set("title", val);
        newModel.set("status", self.myPublic);
        newModel.save(null, {
            success: function () {
                console.log("model saved")
                tasks.fetch();
            },
            error: function () {
                console.log("model saving failed")
            }
        })
    },
    initialize: function (option) {
        this.myPublic = option.option;
        this.model.on("remove", this.render, this);
        this.model.on("add", this.render, this);
        this.model.on("change", this.rener, this);
    },
    render: function () {
        this.$el.html("");
        var template = _.template($("#inputTemplate").html());
        var html = template({status: this.myPublic});
        this.$el.html(html);
        var self = this;
        this.model.each(function (task) {
            if (task.get("status") === self.myPublic) {
                var todoView = new TodoView({ model: task });
                self.$el.append(todoView.render().$el)
            }
        })
        self.$el.append("<br>")
    }
})
var TodoView = Backbone.View.extend({
    events: {
        "click": "onClick",
        "click .remove": "onClickRemove",
        "click .edit": "onClickEdit",
        'change input#editTask': 'editTask'

    },
    insert: function () {
        console.log('submit done')
    },
    onClick: function () {
        console.log("item clicked")
    },
    onClickRemove: function (e) {
        e.stopPropagation();
        tasks.remove(this.model);
        this.model.destroy();
    },
    onClickEdit: function(e){
        e.stopPropagation();
        var template = _.template($("#editTemplate").html());
        var html = template(this.model.toJSON());
        this.$el.html(html);
    },
    editTask: function(event){
        event.stopPropagation();
        var val = $(event.currentTarget).val();
        this.model.set("title", val);
        this.model.save(null, {
            success: function(){
                console.log("edit success");
                tasks.fetch();
            },
            error:function(){
                console.log("server down")
            }
        })
    },
    tagName: "div",
    attributes: function () {
        return {
            id: this.model.get('title')
        }
    },
    initialize: function () {
        this.model.on("change", this.render, this);
        this.id = this.model.toJSON().title;
    },
    render: function () {
        var template = _.template($("#todoTemplate").html());
        var html = template(this.model.toJSON());
        this.$el.html(html);
        return this;
    }
})
function checker() {
    tasks.fetch({
        success: function () {
            var tempArray = [];
            for (var i = 0; i < tasks.length; i++) {
                if (!(_.contains(tempArray, tasks.at(i).get("status")))) {
                    tempArray.push(tasks.at(i).get("status"))
                }
            }
            console.log(tempArray)
            for (i of tempArray) {
                var selector = "#" + i;
                var div = document.createElement("div");
                div.id = i;
                document.body.appendChild(div);
                (new TodosView({ el: selector, model: tasks, option: i })).render();
            }
        },
        error: function () {
            console.log("server down")
        }
    })
}
var tasks = new Collection.Tasks();
checker();