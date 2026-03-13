const mongoose = require("mongoose");

const farmerSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  phone: {
    type: String
  },

  password: {
    type: String,
    required: true
  },

  farmName: {
    type: String
  },

  location: {
    type: String
  }

},
{ timestamps: true });

module.exports = mongoose.model("Farmer", farmerSchema);