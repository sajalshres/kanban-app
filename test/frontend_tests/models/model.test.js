const Model = require('../../../src/models/model')
const expect = require('chai').expect

describe('Task Model', function () {
    let task
    const Task = Model.Task

    beforeEach(function () {
        task = new Task({
            "title": "Basic Programming",
            "status": "Progress",
            "id": 5
        })
    })

    describe('Initialization', function() {
        it('should have defined properties set to the model', function() {
            expect(task.attributes).to.have.property('title', 'Basic Programming')
            expect(task.attributes).to.have.property('status', 'Progress')
            expect(task.attributes).to.have.property('id', 5)
        })
    })

})