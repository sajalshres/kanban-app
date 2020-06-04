const Task = require("../app/models/task");
const Column = require("../app/models/column");
const Tasks = require("../app/collections/tasks");
const Columns = require("../app/collections/columns");
const TimeStamp = require("../app/services/timeNow");
let variables = require("../app/services/variables")
const chai = require("chai");
const assert = chai.assert;
const expect = chai.expect;
// const view_Test = require('./frontend_tests/view.test')


describe("Model and collection tests", function () {
  let task1, task2, task3, tasks, columns, column1, column2;
  this.beforeAll(function () {
    task1 = new Task({
      id: 1,
      name: "github install",
      visible: true,
      created_at: "2020/11/25-11:31",
      modified_at: ""
    });
    task2 = new Task({
      id: 2,
      name: "github and something other to be done are the one",
      visible: true,
      created_at: "2020/11/25-11:31",
      modified_at: ""
    });

    task3 = new Task({
        id: 3,
        name: "docker and something other to be done are the one",
        visible: true,
        created_at: "2020/11/25-11:31",
        modified_at: ""
      });

    column1 = new Column({
      id: 1,
      name: "Todos",
      items: [1,2],
      created_at: "2020/11/25-11:31",
      modified_at: "2020/3/1-3:59"
    });

    column2 = new Column({
      id: 2,
      name: "Progress",
      items: [3],
      created_at: "2020/11/25-11:31",
      modified_at: "2020/4/1-4:43"
    });

    tasks = new Tasks([task1, task2, task3]);
    columns = new Columns([column1, column2]);
  });
  describe("Model Initialization", function () {

    it("task model should have defined properties set to the model", function () {
      expect(task1.attributes).to.have.property("id", 1);
      expect(task1.attributes).to.have.property(
        "name",
        "github install"
      );
      expect(task1.attributes).to.have.property("visible", true);
      expect(task1.attributes).to.have.property(
        "created_at",
        "2020/11/25-11:31"
      );
      expect(task1.attributes).to.have.property("modified_at", "");
    });

    it("column model should have defined properties set to model", function(){
        expect(column1.attributes).to.have.property("id", 1);
        expect(column1.attributes).to.have.property("name", "Todos");
        expect(column1.attributes.items).to.have.ordered.members([1,2])
        expect(column1.attributes).to.have.property("created_at", "2020/11/25-11:31");
        expect(column1.attributes).to.have.property("modified_at", "2020/3/1-3:59");
    })
  });

  describe('Collection initialization', function(){
      it("Column collection model should contain ordered column models", function(){
          expect(columns.models).to.include.ordered.members([ column1, column2]);
      })

      it("Task collection model should contain ordered task models", function(){
          expect(tasks.models).to.include.ordered.members([task1, task2, task3])
      })
  })
});




describe('Services Initialization Test', function(){
  describe("TimeStamp Service", function(){
    it("Should return String", function(){
      assert.typeOf(TimeStamp(), 'string');
    })

    it("Should not contain alphabets", function(){
      expect(TimeStamp()).to.not.match(/[a-zA-Z]+/)
    })
  })

  describe("Variables Service", function(){
    it("Should have defined keys", function(){
      expect(variables).to.have.all.keys('columnCollection', 'taskCollection', 'bufferTaskCollection', 'mySourceId', 'mySourceModel');
    })
  })
})


// require('./frontend_tests/view.test')