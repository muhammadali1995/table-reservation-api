const mongoose = require("mongoose");

const tableSchema = new mongoose.Schema({
    referenceNumber: {
        type: Number,
        required: true,
    },
    seats: {
        type: Number,
        required: true,
    },
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant'
    }
});

const Table = mongoose.model("Table", tableSchema);

module.exports = Table;