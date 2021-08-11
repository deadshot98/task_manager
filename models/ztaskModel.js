const mongoose = require('mongoose')
    // var User = require('./userModel.js')
    // console.log(User)
const { sendmail } = require('../mailsender')

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },

    targettime: {
        type: String,
        required: true
    },

    owner: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User',
    }
}, {
    timestamps: true
})

// taskSchema.post('save', async function() {
//     const owner = this.owner
//     console.log("owner ", owner)
//     const user = await User.findOne({ _id: owner })

//     const toMail = user.email
//     console.log("in post save method")
//     sendmail(tomail, user.name, this.targettime, this.title)

// next()


//})
const Task = mongoose.model('Task', taskSchema)



module.exports = Task