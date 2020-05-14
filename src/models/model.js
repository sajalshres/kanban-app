var Backbone = require('backbone')

var models = {
    "Task" : Backbone.Model.extend({
        url: 'http://localhost:3000/tasks',
        initialize: function(){
            console.log("Task created");
        }
    })
}

module.exports = models;