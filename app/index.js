var Marionette = require('backbone.marionette');  // 1
var Backbone = require('backbone')

var HelloWorld = Marionette.LayoutView.extend({  // 2
    el: '#app-hook',  // 
    attributes: {
        id: "card",

    },


    template: require('./templates/layout.html'),  // 4

});


var hello = new HelloWorld({

});
hello.render();

