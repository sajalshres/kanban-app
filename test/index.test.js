if (typeof exports !== 'undefined' && this.exports !== exports) {
	
	/*
	 * Here's why the node.js environment needs special
	 * treatment: 
	 *
	 *   -  We need to identify dependencies so node.js
	 *      can load the necessary libraries. (In the
	 *      browser, these will be handled by explicit
	 *      includes, either of individual script files
	 *      or of concatenated, possibly minified versions.)
	 *
	 *   -  Node.js doesn't have a DOM into which we
	 *      can insert our views to test interactions.
	 *      We can simulate a DOM with jsdom.
	 *
	 */

  global.jQuery = require("jquery");
  global.$ = jQuery;
  global.chai = require("chai");
  global.sinon = require("sinon");
  chai.use(require("sinon-chai"));

var jsdom = require('jsdom');
const { JSDOM } = jsdom;

const document = new JSDOM("<html><body></body></html>")).window;
global.document = document;
global.window = document.createWindow();

}
var should = chai.should();

  describe("Initialization", function() {
      beforeEach(function() {
          this.task = new Task();
          console.log(this.task);
      })
      it("should default the id to an empty string",function() {
          this.task.get('id').should.equal("");
      })
  })
  
  
  // this code is not working.
  
  
  describe("Persistence", function() {
    beforeEach(function() {
      this.task = new Task();
      this.save_stub = sinon.stub(this.task, "save");
    })
    afterEach(function() {
      this.save_stub.restore();
    })
    it("should update server when name is changed", function() {
      this.task.set("name", "New Summary");
      this.save_stub.should.have.been.calledOnce;
    })
    it("should update server when status is changed", function() {
      this.task.set('id',5);
      this.save_stub.should.have.been.calledOnce;
    })
  })
  
  
      
  describe("Todo List Item View", function() {
    beforeEach(function(){
      var TaskContainer = require('../app/views/test');
      var taskContainer = new TaskContainer();
      this.todo = new Task ({name: "Summary"});
      this.item = new taskContainer({model: this.todo});
    })
    it("render() should return the view object", function() {
      this.item.render().should.equal(this.item);
    });
    
  })


var sum = 2 + 2;


describe("Application", function() {
  it("sums", function () {
    sum.should.equal(4);
  })
})