const express = require('express')
const router = express.Router()

router.get('/' , function(req , res, next) {
    const smsg = req.flash('success')
    res.render('index2' , {
        success : smsg ,
        error : req.flash('error')
    })
})

router.get('/contactus' , function(req , res){
    res.render('contactform')
})

module.exports = router 

