const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
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
    age: {
        type: Number,
        required: true
    },
    dateUpdated: {
        type: Date,
        required: true
    }
}
);
module.exports = mongoose.model("stock", stockSchema);