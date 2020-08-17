let assert = require("chai").assert;
let should = require("chai").should;
const Task = require("./../../app/models/task");
const Column = require("./../../app/models/column");
const Tasks = require("./../../app/collections/tasks");
const Columns = require("./../../app/collections/columns");
let MainContainer = require("../../app/views/MainContainer");

module.exports = describe("View test", function () {
  let mainContainer;
  let task1, task2, task3, tasks, columns, column1, column2;
  this.beforeAll(function () {
    task1 = new Task({
      id: 1,
      name: "github install",
      visible: true,
      created_at: "2020/11/25-11:31",
      modified_at: "",
    });
    task2 = new Task({
      id: 2,
      name: "github and something other to be done are the one",
      visible: true,
      created_at: "2020/11/25-11:31",
      modified_at: "",
    });

    task3 = new Task({
      id: 3,
      name: "docker and something other to be done are the one",
      visible: true,
      created_at: "2020/11/25-11:31",
      modified_at: "",
    });

    column1 = new Column({
      id: 1,
      name: "Todos",
      items: [1, 2],
      created_at: "2020/11/25-11:31",
      modified_at: "2020/3/1-3:59",
    });

    column2 = new Column({
      id: 2,
      name: "Progress",
      items: [3],
      created_at: "2020/11/25-11:31",
      modified_at: "2020/4/1-4:43",
    });

    tasks = new Tasks([task1, task2, task3]);
    columns = new Columns([column1, column2]);
    mainContainer = new MainContainer({
        collection: columns
    });
  });
  it("should be it", function () {});
});
