const mongoose = require('mongoose');

const salesSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    firstName: String,
    lastName: String,
    farmer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    type: {
        type: String,
        required: true
    },
    breed: {
        type: String,
        required: true
    },
    farmerType: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    dateUpdated: {
        type: Date,
        required: true
    }
});
module.exports = mongoose.model("sale", salesSchema);