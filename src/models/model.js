var Backbone = require('backbone')

var models = {
    "Task" : Backbone.Model.extend({
        url: function(){
            if(!this.id){
                return 'http://localhost:3000/tasks';
            }else{
                return 'http://localhost:3000/tasks/' + this.id;
            }
        },
        initialize: function(){
        }
    })
}

module.exports = models;