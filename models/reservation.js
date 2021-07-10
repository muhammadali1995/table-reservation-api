const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema({
    date: {
        type: Date,
        min: Date.now,
        required: true
    },
    time: {
        type: String,
        required: true,
    },
    customerName: {
        type: String,
        required: true
    },
    customerPhoneNumber: {
        type: String,
        required: true
    },
    table: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Table'
    }
});

const Reservation = mongoose.model("Reservation", reservationSchema);

module.exports = Reservation;