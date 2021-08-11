const express = require('express')
const router = express.Router()
const { body, validationResult, check } = require('express-validator')
const passport = require('passport')
const User = require('../models/userModel')
console.log("user.js", User)
const LocalStrategy = require('passport-local').Strategy
const taskRouter = require('../routes/task')
const authMidware = require('../middlewares/auth')
const flash = require('connect-flash')



router.get('/', function(req, res, next) {
    res.send('inside users')
})

router.get('/login', (req, res) => {
    res.render('login')
})

router.get('/register', (req, res) => {
    res.render('register')
})

router.post('/register', check('name', 'Name field is required').notEmpty(),
    check('email', 'Email Field Required').notEmpty(),
    check('email', 'Email is Invalid').isEmail(),
    check('password').notEmpty(),
    check('confirmpassword').notEmpty(),
    async function(req, res, next) {

        var name = req.body.name
        var email = req.body.email
        var password = req.body.password
        var password2 = req.body.confirmpassword


        var errors = validationResult(req)

        if (password !== password2) {
            errors.errors.push({
                value: password2,
                msg: 'Passwords dont match',
                param: 'confirmpassword',
                location: 'body'
            })
        }
        // var errors = ""

        if (true) {
            const data = {
                name,
                email,
                password
            }

            const user = new User(data)
            try {
                await user.save()

                req.flash('success', 'You are now registered and can login')
                res.location('/')
                res.redirect('/')
            } catch (error) {
                //console.log("in here")
                console.log(error)
                res.render('register', {
                    error: "Unable to create your account"
                })
            }




        } else {
            console.log(errors.errors)
            res.render('register', {
                error: "Unable to create User"
            })
        }
        // console.log(req.body)


    })

router.post('/login', passport.authenticate('local', { failureRedirect: '/', failureFlash: true }), function(req, res) {
    req.flash('success', "You have successfully logged in")
    res.redirect('/')
})



router.get('/createTask', authMidware.ensureAuthenticated, function(req, res) {
    res.render('createtask')
})



router.get('/logout', function(req, res) {
    req.logout()
    res.redirect('/users/login')
})

router.use('/', taskRouter)

module.exports = router