var Backbone = require('backbone');
var Model = require('./models/model');
var Collection = require('./collections/collection')
var _ = require('underscore')
var $ = require('jquery')
var tempArray =[];
var inputActive = false;


var lanesView = Backbone.View.extend({
    events: {
        "click .addLaneInputEnable": "onAddLane",
        "input .laneInput": "syncer",
        "click .cancel": "onCancel",
        "click .create": "onCreate"
    },
    onCreate: function () {
        event.stopPropagation();
        tempArray.push(this.myPublic);
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
        if (this.myPublic === "" || (_.contains(tempArray, this.myPublic))) {
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
    initialize: function () {
        this.myPublic = ""
        console.log("lane view created")
    },
    render: function () {
        var template = _.template($("#addLaneTemplate").html());
        var html = template();
        this.$el.html(html);
    }
})
var TodosView = Backbone.View.extend({
    events: {
        'change input#newTask': 'loadTask',
        "click #add":"newTodo",
        "click #newTodo": "toggleInputField",
        "click #cancelTodo":"cancelTodo",
       
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
    initialize: function (option) {
        console.log("ya samma chalyo")
        this.myPublic = option.option;
        this.model.on("remove", this.render, this);
        this.model.on("add", this.render, this);
        this.model.on("change", this.rener, this);
    },
    render: function () {
        this.$el.html("");
        var template = _.template($("#inputTemplate").html());
        var html = template({ status: this.myPublic });
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

        "click .remove": "onClickRemove",
        "input .editTask": "syncer",
        "click .cancel": "onClickCancel",
        "click .editText": "editTask",
       
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
        this.$el.on('input', '#selectId', function () {
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
    render: function () {
        var pointer = this;
        var template = _.template($("#todoTemplate").html());
        var html = template(this.model.toJSON());
        this.$el.html(html);
        var self = $("<select id='selectId'>");
        self.append("<option selected></option>");
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
})
function checker() {
    tasks.fetch({
        success: function () {
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
                div.className="card";
                $("#contain").append(div);
                (new TodosView({ el: selector, model: tasks, option: i })).render();
            }
        },
        error: function () {
            console.log("server down")
        }
    })
}
var div = document.createElement("div");
div.id = "addLane";
document.body.appendChild(div);
var newLanesView = new lanesView({ el: "#addLane" });
var tasks = new Collection.Tasks();
newLanesView.render();
checker();