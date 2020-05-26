var Backbone = require("backbone");

module.exports = Backbone.Model.extend({
  url: function () {
    if (this.id) {
      return "http://localhost:3000/columns/" + this.id;
    } else {
      return "http://localhost:3000/columns";
    }
  },

  initialize: function () {},
});
