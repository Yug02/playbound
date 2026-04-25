// backend/models/Request.js
const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' // This links to our User model
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    game: {
        type: String,
        required: true
    },
    proposedTime: {
        type: String,
        required: true
    },
    message: {
        type: String
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'declined'],
        default: 'pending' // Every new request starts as pending
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Request', requestSchema);