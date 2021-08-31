const request = require('supertest')
const app = require('../src/app')
const Task = require('../src/models/task')
const {userOneId, userOne, userTwoId, userTwo, configDatabase} = require('./fixtures/db')
const {taskOne, taskTwo, taskThree} = require('./fixtures/db')

beforeEach(configDatabase)

test('Should create a task', async function() {
    const response = await request(app).post('/tasks').set('Authorization', `Bearer ${userOne.tokens[0].token}`).send({description: 'XYZ from test'}).expect(201)
    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
    expect(task.completed).toBe(false)
})

test('Get all tasks for user one', async function() {
    const response = await request(app).get('/tasks').set('Authorization', `Bearer ${userOne.tokens[0].token}`).expect(200)
    const tasks = await Task.find({author: userOneId})
    expect(response.body.length).toBe(2)
})

test('Attempt to delete other user task', async function() {
    const response = await request(app).delete(`/tasks/${taskOne._id}`).set('Authorization', `Bearer ${userTwo.tokens[0].token}`).expect(404)
    const task = await Task.findById(taskOne._id)
    expect(task).not.toBeNull()
})