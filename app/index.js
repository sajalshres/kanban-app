var Collection = require('./collections/collection')
var  TodosView =require( './views/todoListView');
var _ = require('underscore');
var $= require('jquery');



checker = () => {
    tasks.fetch({
        success: () => {
            var  tempArray =[];
            for (var i=0;i<tasks.length;i++){
                if(!(_.contains(tempArray,tasks.at(i).get("status")))){
                    tempArray.push(tasks.at(i).get("status"))
                }
            }

            for (i of tempArray){
                var selector= "#"+i;
                var div= document.createElement("div");
                div.id=i;
                document.body.appendChild(div);
                (new TodosView({ el: selector, model: tasks, option: i })).render();
            }
        },error: () => {
            console.log("server down")
        }
    })
}

var tasks = new Collection.Tasks();
checker();