const mongoose = require("mongoose");

// Define Customer Schema
const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true
  },
  address: {
    type: String
  }
}, { timestamps: true });

// Create and export model
module.exports = mongoose.model("Customer", customerSchema);
