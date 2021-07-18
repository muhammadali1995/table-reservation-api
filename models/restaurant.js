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


restaurantSchema.statics.findByOwner = async (manager) => {
  const restaurant = await Restaurant.findOne({ manager });

  if (!restaurant) {
    return null;
  }

  return restaurant;
};


const Restaurant = mongoose.model("Restaurant", restaurantSchema);

module.exports = Restaurant;