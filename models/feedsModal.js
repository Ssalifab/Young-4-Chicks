const mongoose = require('mongoose');

const feedSchema = new mongoose.Schema({
    feedName: {
        type: String,
        required: true
    },
    feedType: {
        type: String,
        required: true
    },
    targetAge: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    expiryDate: {
        type: Date,
        required: true
    },
    dateUpdated: {
        type: Date,
        required: true
    }
}
);
module.exports = mongoose.model("feed", feedSchema);