const express = require("express");

const {
    createBusiness,
    getBusinesses,
    getBusinessById,
    updateBusiness,
    deleteBusiness
} = require("../controllers/businessController");

const router = express.Router();

router.post("/", createBusiness);

router.get("/", getBusinesses);

router.get("/:id", getBusinessById);

router.put("/:id", updateBusiness);

router.delete("/:id", deleteBusiness);

module.exports = router;