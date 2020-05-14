var Backbone = require('backbone');
var Model = require('./../models/model')

var collection = {
    "Tasks" : Backbone.Collection.extend({
        url: 'http://localhost:3000/tasks',
        initialize: function(){
            console.log("Tasks initialized")
        },
        model: Model.Task
    })
}

module.exports = collection;