const express = require("express");

const router = express.Router();

const { getCompany } = require("../services/companyService");

router.get("/:companyId", async (req, res) => {

    const company = await getCompany(req.params.companyId);

    if (!company) {
        return res.status(404).json({
            error: "Company not found"
        });
    }

    res.json(company);

});

module.exports = router;