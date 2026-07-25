require("dotenv").config();

const mongoose = require("mongoose");

const { getCompany } = require("../services/companyService");

async function test() {
    await mongoose.connect(process.env.MONGODB_URI);

    const company = await getCompany("abc-solar");

    console.log(company);

    process.exit();
}

test();