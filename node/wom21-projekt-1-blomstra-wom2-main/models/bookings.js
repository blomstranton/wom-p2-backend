const mongoose = require('mongoose')

const bookingsSchema = new mongoose.Schema({
    owner: {
        type: String,
        required: true,
    },
    cabin: {
        type: String,
        required: true,
    },
    startDate : {
        type: Date,
        required: true,
    },
    endDate : {
        type: Date,
        required: true,
    }
}, { timestamps: true })

module.exports = mongoose.model(
    'Booking',
    bookingsSchema
)