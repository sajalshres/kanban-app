var Backbone = require('backbone');
var Model = require('./models/model');
var Collection = require('./collections/collection')
var View = require('./views/view')

var tasksTodo = new Collection.Tasks([
    new Model.Task({title: 'github'}),
    new Model.Task({title: 'docker'})
])

var todosViews = new View.Todos({el:"#tasks", model: tasksTodo})

todosViews.render();










