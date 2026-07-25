const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
  companyId: {
    type: String,
    unique: true,
    required: true,
  },

  companyName: String,

  receptionistName: String,

  expertName: String,

  greeting: String,

  services: [String],

  panelBrands: [String],

  microInverters: [String],

  website: String,

  phone: String,

  email: String,

  address: String,
});

module.exports = mongoose.model("Company", companySchema);