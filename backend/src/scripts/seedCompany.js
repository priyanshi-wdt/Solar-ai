const mongoose = require("mongoose");
require("dotenv").config();

const Company = require("../models/Company");

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);

  await Company.deleteMany({ companyId: "abc-solar" });

  await Company.create({
    companyId: "abc-solar",

    companyName: "ABC Solar",

    receptionistName: "Kristin",

    expertName: "Greg",

    greeting: "Hello! My name is Kristin. How can I help you today?",

    phone: "123-456-7890",

    email: "info@abcsolar.com",

    website: "https://abcsolar.com",

    services: [
      "Residential Solar Installation",
      "Commercial Solar Installation",
      "Solar Consultation",
      "Battery Storage",
      "Solar Maintenance"
    ],

    panelBrands: [
      "REC Solar",
      "Maxeon",
      "Qcells",
      "Canadian Solar"
    ],

    microInverters: [
      "Enphase",
      "APsystems"
    ]
  });

  console.log("✅ Company inserted successfully");

  process.exit();
}

seed();