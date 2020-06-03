var Backbone = require('backbone');

var columnModel  = Backbone.Model.extend({
  url: function () {
    if (this.id) {
      return "http://localhost:3000/columns/" + this.id;
    } else {
      return "http://localhost:3000/columns";
    }
  },

  initialize: function () {},
});

module.exports = columnModel
