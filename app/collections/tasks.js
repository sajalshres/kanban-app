var Backbone = require('backbone');
var task = require('../models/task');

var taskCollection =   Backbone.Collection.extend({
    url: 'http://localhost:3000/tasks',
    model:task,
})
// export default tasks;
module.exports = taskCollection;