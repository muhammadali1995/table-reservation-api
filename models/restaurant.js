const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  tables: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Table'
  },
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

const Restaurant = mongoose.model("Restaurant", restaurantSchema);

module.exports = Restaurant;