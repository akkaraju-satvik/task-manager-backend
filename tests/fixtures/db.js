const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../../src/models/user')
const Task = require('../../src/models/task')

const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    _id: userOneId,
    name: 'Satvik',
    email: 'sakkaraju33@gmail.com',
    password: 'wut?123',
    tokens: [
        {
            token: jwt.sign({_id: userOneId}, process.env.JWT_SECRET)
        }
    ]
}

const userTwoId = new mongoose.Types.ObjectId()
const userTwo = {
    _id: userTwoId,
    name: 'Akkaraju Satvik',
    email: 'satvik.akkaraju@gmail.com',
    password: 'lul@123',
    tokens: [
        {
            token: jwt.sign({_id: userTwoId}, process.env.JWT_SECRET)
        }
    ]
}

const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Task 1',
    completed: false,
    author: userOneId,
}

const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Task ',
    completed: true,
    author: userOneId,
}

const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Task 3',
    completed: false,
    author: userTwoId,
}

const configDatabase = async function() {
    await User.deleteMany({})
    await Task.deleteMany({})
    await new User(userOne).save()
    await new User(userTwo).save()
    await new Task(taskOne).save()
    await new Task(taskTwo).save()
    await new Task(taskThree).save()
}

module.exports = {
    userOneId,
    userOne,
    userTwo,
    userTwoId,
    taskOne,
    taskTwo,
    taskThree,
    configDatabase
}