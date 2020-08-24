Backbone =require('backbone');
var models = require('../models/model')

var collection = {
    "Tasks" : Backbone.Collection.extend({
        url: 'http://localhost:3000/tasks',

        initialize: function(){
            console.log("Tasks initialized")
        },
        model: models.Task
    })
}

module.exports = collection;