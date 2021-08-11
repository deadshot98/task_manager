const mongoose = require('mongoose')
const vldt = require('validator')
const bcrypt = require("bcryptjs")

const Task = require('./ztaskModel')


//when we need to use the middleware , as middleware works on schema , we need to have named to work upon it 

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name cant be empty"],
        trim: true,
        validate: (value) => {
            if (value.length < 2) {
                throw new Error("Enter Valid Name")
            }
        }

    },

    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,

        validate: (value) => {
            if (!vldt.isEmail(value)) {
                throw new Error("Enter Valid Email_Id")
            }
        }
    },

    password: {
        type: String,
        required: [true, "Password field cant be empty"],
        minLength: [8, "Password length can not be less than 8 ."],
        validate: (value) => {
            if (value.includes("password")) {
                throw new Error("Password cant contain 'password' in it . ")
            }
        }
    },


})

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

//Following method ensures that what has to be sent when we send 'user' back  , note :- whenever we call JSON.stringify , this.toJSON is called in the background  ,
// So we will manupulate(like method overriding) that to ensure the changes 
// userSchema.methods.toJSON = function(){

//     const user = this
//     const userObject = user.toObject()

//     delete userObject.password
//     delete userObject.tokens

//     return userObject
// }



// checking credentials , Schema.statics helps us to make static methods which will be directly available to fetch using model name , like User.findbyCredentials
userSchema.statics.findbyCredentials = async function(email, password) {
    const user = await User.findOne({ email })

    if (!user) {
        throw new Error("Invalid Credentials")
    }

    isValid = await bcrypt.compare(password, user.password)

    if (!isValid) {
        throw new Error("Invalid Credentials")
    }

    return user

}
userSchema.pre('save', async function(next) { // dont use arrow function here , as we need to have access to "this" in inside  , 
    // and arrow funtion dont bind "this"

    const user = this

    if (user.isModified("password")) {

        user.password = await bcrypt.hash(user.password, 8)
        next()
    }


})

//Cascading remove , it means before a user gets deleted , all tasks related to them gets deleted 

userSchema.pre('remove', async function(next) {
    const user = this

    await Task.deleteMany({ owner: user._id })

    next()
})

const User = mongoose.model('User', userSchema)


module.exports = User