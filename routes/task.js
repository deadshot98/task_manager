const express = require('express')
const Task = require('../models/ztaskModel')
const auth = require('../middlewares/auth')
const router = express.Router()
const { sendMail } = require('../mailsender')


router.post('/createTask', auth.ensureAuthenticated, async(req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })

    try {
        await task.save()

        const owner = task.owner
        console.log("owner ", owner)
        const user = req.user

        const toMail = user.email
        console.log("in post save method")
        sendMail(toMail, user.name, task.targettime, task.title)



        res.render('createTask', {
            success: "Task created . Create More !",
            user: true

        })
    } catch (e) {
        console.log(e)
        res.render('createTask', {
            error: "Some error occurred , Create task again !",
            user: true
        })
    }
})

// GET /tasks?completed=true
// GET /tasks?limit=10&skip=20
// GET /tasks?sortBy=createdAt:desc
router.get('/tasks', auth.ensureAuthenticated, async(req, res) => {
    const match = {}
    const sort = {}

    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try {
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: 10,
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()



        var tasks = []
        if (req.user.tasks.length != 0) {
            req.user.tasks.forEach(value => {
                var singletask = {}
                singletask.title = value.title
                singletask.description = value.description
                var nowInTime = new Date().getTime()
                var createdInTime = value.createdAt.getTime()
                    // console.log(createdInTime)
                var daysOver = ((nowInTime - createdInTime) / (1000 * 3600 * 24)).toFixed(2)
                    //console.log(daysOver)
                var daysleft = (value.targettime - daysOver).toString()
                singletask.daysleft = parseInt(Math.ceil(daysleft))
                    // var days = daysleft.slice(0, daysleft.indexOf('.')) 
                    // var hours = daysleft.slice(daysleft.indexOf('.')) 
                    // hours = (parseFloat(hours)*24).toFixed(2)

                // singletask.days = days || 0


                // hours = (hours.toString())
                // var actHours = hours.slice(0, hours.indexOf('.')) 
                // var mins = hours.slice(hours.indexOf('.')) 
                // mins = (parseFloat(mins)*60).toFixed(0)


                // singletask.hours = actHours
                // singletask.mins = mins
                tasks.push(singletask)


            });

        }


        res.render('mytasks', {
            tasks,
            user: true
        })
    } catch (e) {
        res.render('mytasks', {
            error: "Some error occurred ! Unable to show your Tasks",
            user: true
        })
    }
})

module.exports = router