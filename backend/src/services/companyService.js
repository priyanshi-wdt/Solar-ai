const Company = require("../models/Company");

async function getCompany(companyId) {
  return await Company.findOne({ companyId });
}

module.exports = {
  getCompany,
};