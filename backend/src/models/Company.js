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
  businessHours: {
    monday: {
      open: String,
      close: String,
      closed: {
        type: Boolean,
        default: false,
      },
    },

    tuesday: {
      open: String,
      close: String,
      closed: {
        type: Boolean,
        default: false,
      },
    },

    wednesday: {
      open: String,
      close: String,
      closed: {
        type: Boolean,
        default: false,
      },
    },

    thursday: {
      open: String,
      close: String,
      closed: {
        type: Boolean,
        default: false,
      },
    },

    friday: {
      open: String,
      close: String,
      closed: {
        type: Boolean,
        default: false,
      },
    },

    saturday: {
      open: String,
      close: String,
      closed: {
        type: Boolean,
        default: false,
      },
    },

    sunday: {
      open: String,
      close: String,
      closed: {
        type: Boolean,
        default: true,
      },
    },
  },
});

module.exports = mongoose.model("Company", companySchema);