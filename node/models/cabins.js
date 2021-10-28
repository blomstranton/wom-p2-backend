const mongoose = require('mongoose')

const cabinsSchema = new mongoose.Schema({
    owner: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
        unique: true
    },
    sqm: {
        type: Number,
        required: true
    },
    sauna: {
        type: Boolean,
        required: true
    },
    beach: {
        type: Boolean,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    beds: {
        type: Number,
        required: true
    },
    extraInfo: {
        type: String,
        required: false
    },
    archived: {
        type: Boolean,
        required: true
    },
}, { timestamps: true })

module.exports = mongoose.model(
    'Cabin',
    cabinsSchema
)