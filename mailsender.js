const schedule = require('node-schedule')
const express = require('express')
const Task = require('./models/ztaskModel.js')
const User = require('./models/userModel.js')
const router = express.Router()
const sgMail = require('@sendgrid/mail')
const { handlebars } = require('hbs')
const fs = require("fs")


const sendMail = async function(email, name, targettime, title) {
    console.log("1")
    const apikey = 'API_KEY'

    sgMail.setApiKey(apikey)

    // const template = "./templates/views/clientmail.hbs"
    // console.log("2", __dirname)
    // const source = fs.readFileSync(path.join(__dirname, template), "utf8")
    // console.log("3")
    // const compiledTemplate = handlebars.compile(source)

    var daysleft = targettime
    console.log("thth", targettime)
    if (targettime > 0) {
        const job = schedule.scheduleJob('5 * * * * *', async function() {
            console.log("job")
            try {
                if (daysleft == 0) {
                    job.cancel()
                }
                await sgMail.send({
                    to: email,
                    from: "anshu.anand.fiem.cse17@teamfuture.in",
                    subject: "Reminder from Task Manager",
                    text: `This is a reminder for ${title}.
                    You have ${daysleft} days left to complete your job.
                    Regards
                    Team Task Manager.`

                });
                console.log('Test email sent successfully');
                daysleft--
            } catch (error) {
                console.error('Error sending test email');
                console.error(error);
                //   if (error.response) {
                //     console.error(error.response.body)
            }

            console.log('The answer to life, the universe, and everything!');
        });
    }


}

module.exports = {
    sendMail
}