require('./db/mongoose')
const express = require('express')
const hbs = require('hbs')
const path = require('path')
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const flash = require('connect-flash')
const mongoose = require('mongoose')
const expressValidator = require('express-validator')
require('dotenv').config({ path: __dirname + './.env' })

var routes = require('./routes/index')
var users = require("./routes/users")

const { read } = require('fs')

var app = express()

//view engine setup
app.set('views', path.join(__dirname, './templates/views'))
app.set('view engine', 'hbs')
hbs.registerPartials(path.join(__dirname, './templates/partials'))


app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, './public')))


//handle sessions 
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    }
}))

//passport 
app.use(passport.initialize())
app.use(passport.session())

//validator
//app.use(expressValidator())

//handling messages on redirection
app.use(flash())

app.get('*', function(req, res, next) {
    res.locals.user = req.user || null
    next()
})

app.use('/', routes)
app.use('/users', users)

app.listen(3000, () => {
    console.log("Server up and running ")
})