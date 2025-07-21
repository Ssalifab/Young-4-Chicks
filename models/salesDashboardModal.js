const mongoose = require('mongoose');

const salesSchema = new mongoose.Schema({
    farmerName:{
        type: String,
        required: true
    },
    nin:{
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    type:{
        type: String,
        required: true
    },
    breed:{
        type: String,
        required: true
    },
    farmerType:{
        type: String,
        required: true
    },
    quantity:{
        type: Number,
        required: true
    },
    dateUpdated:{
        type: Date,
        required: true
    }
});
module.exports = mongoose.model("sale", salesSchema);