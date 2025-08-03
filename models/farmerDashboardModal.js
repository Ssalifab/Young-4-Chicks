const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.Object,
        ref: "user",
        required: true,
    },
    farmerType: {
        type: String,
        required: true,
        enum: ["starter", "returning"]
    },
    chickType: {
        type: String,
        required: true
    },
    breed: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
     unitPrice: {
        type: Number,
        required: true
    },
     totalPrice: {
        type: Number,
        required: true
    },
    dateUpdated: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "approved","dispatched","canceled"],
        default: "pending"
    },
    lastTakenDate: Date
});
module.exports = mongoose.model("request", requestSchema);