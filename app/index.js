var Collection = require('./collections/collection')
var  TodosView =require( './views/todoListView');
var lanesView = require('./views/lanesView');
var _ = require('underscore');
var $= require('jquery');
var tempArray = [];

checker = () => {
    tasks.fetch({
        success: () => {
            for (var i=0;i<tasks.length;i++){
                if(!(_.contains(tempArray,tasks.at(i).get("status")))){
                    tempArray.push(tasks.at(i).get("status"))
                }
            }

            for (i of tempArray){
                var selector= "#"+i;
                var div= document.createElement("div");
                div.id=i;
                div.className="card";
                $("#contain").append(div);
                (new TodosView({ el: selector, model: tasks, option: i,tempArray })).render();
            }
        },error: () => {
            console.log("server down")
        }
    })
}


var div = document.createElement("div");
div.id = "addLane";
$("#addLane").append(div);
var newLanesView = new lanesView({ el: "#addLane" ,tempArray});
var tasks = new Collection.Tasks();
newLanesView.render();
checker();

