import Backbone from 'backbone';
import TaskModel from '../models/task'

var TaskCollection = Backbone.Collection.extend({
  url: "http://localhost:3000/tasks",
  model: TaskModel,
  initialize: function () {},
});

export default TaskCollection;
