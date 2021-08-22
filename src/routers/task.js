const express = require('express');
const Task = require('../models/task')
const auth = require('../middleware/auth')
const router = new express.Router();

router.post('/tasks/', auth, async function(req, res) {
    const task = new Task({
        ...req.body,
        author: req.user._id
    })

    try {
        await task.save()
        res.status(200).send(task)
    } catch(error) {
        res.status(400).send(error)
    }

})

router.get('/tasks/', auth, async function(req, res) {
    const match = {}
    const sort = {}
    if(req.query.completed) match.completed = (req.query.completed === 'true')    
    if(req.query.sortBy) {
        const sortby = req.query.sortBy.split('_')[0]
        sort[sortby] = (req.query.sortBy.split('_')[1] === 'desc') ? -1 : 1
    }

    try {
        await req.user.populate(
            {
                path: 'tasks',
                match,
                options: {
                    limit: parseInt(req.query.limit),
                    skip: parseInt(req.query.skip*parseInt(req.query.limit)),
                    sort
                }
            }
        ).execPopulate()
        res.status(200).send(req.user.tasks)
    } catch(error) {
        res.status(500).send()
    }

})

router.get('/tasks/:id', auth, async function(req, res) {
    const _id = req.params.id
    try {
        const task = await Task.findOne({_id, author: req.user._id})
        if(!task) return res.status(404).send();
        res.send(task)
    } catch(error) {
        res.status(500).send()
    }
})

router.patch('/tasks/:id', auth, async function(req, res) {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidUpdate = updates.every((update) => allowedUpdates.includes(update))

    if(!isValidUpdate) return res.status(400).send({error: 'Invalid update'});

    const _id = req.params.id

    try {
        const task = await Task.findOne({_id, author: req.user._id})
        if(!task) return res.status(404).send()

        updates.forEach((update) => task[update] = req.body[update])
        await task.save()
        res.send(task)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.delete('/tasks/:id', auth, async function(req, res) {
    try {
        const task = await Task.findOneAndDelete({_id: req.params.id, author: req.user._id})
        if(!task) return res.status(404).send()
        res.send(task)
    } catch (error) {
        res.status(500).send()
    }
})

module.exports = router