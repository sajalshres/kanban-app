global.jQuery = require("jquery");
global.$ = jQuery;
global.chai = require("chai");
var should = chai.should();
global.sinon = require("sinon");
chai.use(require("sinon-chai"));


var sum = 2 + 2;

sum.should.equal(4);

describe("Application", function() {
  it("sums", function () {
    sum.should.equal(4);
  })
})