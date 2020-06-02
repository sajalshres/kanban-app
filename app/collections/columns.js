import Backbone from 'backbone';
import columnModel from "../models/column";

var  ColumnCollection = Backbone.Collection.extend({
  url: "http://localhost:3000/columns",
  model: columnModel,
  initialize: function () {},
});

export default ColumnCollection;