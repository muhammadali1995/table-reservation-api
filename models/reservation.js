const mongoose = require("mongoose");

const schemaOptions = {
    timestamps: { end: 'end', start: 'start' },
};

const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);

const reservationSchema = new mongoose.Schema({
    date: {
        type: Date,
        min: yesterday,
        required: true
    },
    start: {
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
}, schemaOptions);


reservationSchema.statics.findByRestaurant = async (restaurant) => {
    return await Reservation.find({ 'table.restaurant': restaurant });
};


const Reservation = mongoose.model("Reservation", reservationSchema);

module.exports = Reservation;