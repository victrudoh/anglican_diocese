const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const AccommodationSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    rooms: {
        type: Number,
        required: true,
    },
    alias: {
        type: String,
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model("Accommodation", AccommodationSchema);