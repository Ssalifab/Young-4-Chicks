const mongoose = require('mongoose');

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
        unique: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
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
    },
    password:{
        type: String,
        required: true,
        trim: true
    },
    confirmPassword:{
        type: String,
        required: true,
        trim: true
    }
});
module.exports = mongoose.model("user", userSchema);