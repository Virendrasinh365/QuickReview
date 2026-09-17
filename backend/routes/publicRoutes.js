const express = require("express");

const {
    getPublicBusiness
} = require("../controllers/publicController");

const router = express.Router();

router.get("/business/:slug", getPublicBusiness);

module.exports = router;