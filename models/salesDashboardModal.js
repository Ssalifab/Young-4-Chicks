const mongoose = require('mongoose');


// const salesSchema = new mongoose.Schema({
//     farmer: { 
//         type: mongoose.Schema.Types.ObjectId, 
//         ref: 'User', 
//         required: true 
//     },
//     user: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User",
//         required: true,
//     },
//     submittedBy: { 
//         type: mongoose.Schema.Types.ObjectId, 
//         ref: 'User', 
//         required: true 
//     },
//     farmerName: {
//         type: String,
//     },
//    type: {
//         type: String,
//         required: true
//     },
//     breed: {
//         type: String,
//         required: true
//     },
//     farmerType: {
//         type: String,
//         required: true,
//         enum: ["starter", "returning"]
//     },
//     quantity: {
//         type: Number,
//         required: true
//     },
//     dateUpdated: {
//         type: Date,
//         default: Date.now
//     },
//     status: { 
//         type: String, 
//         default: 'pending' 
//     } 
// },{ timestamps: true });
const salesSchema = new mongoose.Schema({
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true, enum: ['layer', 'broiler'] },
    breed: { type: String, required: true, enum: ['local', 'exotic'] },
    farmerType: { type: String, required: true, enum: ['starter', 'returning'] },
    quantity: { type: Number, required: true, min: 1 },
    dateUpdated: { type: Date, default: Date.now }, // Default if not provided
    status: { type: String, default: 'pending', enum: ['pending', 'approved', 'rejected'] }
}, { timestamps: true });
module.exports = mongoose.model("sale", salesSchema);