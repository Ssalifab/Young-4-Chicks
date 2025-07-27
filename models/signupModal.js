const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    nin: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true
    },
    phone:{
        type: String,
        required: true,
        trim: true
    },
    address:{
        type: String,
        required: true
    },
    recommenderName: {
        type: String,
        trim: true
    },
    recommenderEmail: {
        type: String,
        trim: true
    },
    recommenderPhone: {
        type: String,
    },
    role:{
        type: String,
        required: true
    }
});
// Remove the username field from the schema if you're not using it
userSchema.remove('username');

userSchema.plugin(passportLocalMongoose,{
    usernameField: 'email',
    usernameUnique: true, // ensures email is unique
    usernameLowerCase: true // converts email to lowercase
})
module.exports = mongoose.model("user", userSchema);