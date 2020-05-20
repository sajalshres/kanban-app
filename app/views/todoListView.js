var Marionete =require ('backbone.marionette');
var Collection = require('../collections/collection')
var Backbone = require('backbone');
 var TodoView = require('./todoCollectionView');
 var model = require('../models/model');
 var $ = require('jquery');
 var _ = require('underscore');
 var inputActive = false;

var tasks = new Collection.Tasks();
 var TodosView = Backbone.View.extend({
    events: {
        'change input#newTask': 'loadTask',
        "click #add":"newTodo",
        "contextmenu .each-task": "newMenu",
        "click #newTodo": "toggleInputField",
        "click #cancelTodo":"cancelTodo",
    },
    loadTask: function (event){
        var val = $(event.currentTarget).val();
        console.log(val);
        var newModel = new model.Task();
        var self = this;
        newModel.set("title", val);
        console.log(self.myPublic);
        newModel.set("status", self.myPublic);
        newModel.save(null, {
            success: function () {
                // console.log("model saved")
                tasks.fetch();
            },
            error: function () {
                // console.log("model saving failed")
            }
        })
    },
    newTodo: function (event) {
    
        this.toggleInputField();
    

    },
    cancelTodo: function () {
        this.toggleInputField();
    },
    toggleInputField: function (){
        if(!inputActive){
        $("#inputField").show();
        $("newTodo").hide();
        inputActive=true;
        }
        else{
            $("newTodo").show();
            $("#inputField").hide();
           
            inputActive=false;
        }

       
    },
    newMenu: function(event) {
        event.preventDefault()
        $(".custom-menu").css({
          "top": `${event.clientY + 30}px`,
          "left": `${event.clientX + 30}px`,
          "display": "block"
        });
    },
    initialize:  function (option) {
        this.myPublic = option.option;
        console.log(option);
        this.model.on("remove", this.render, this);
        this.model.on("add", this.render, this);
        this.model.on("change", this.rener, this);
    },
    render: function() {
        console.log(this.myPublic)
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

module.exports = TodosView;