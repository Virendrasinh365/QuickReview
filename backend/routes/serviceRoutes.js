const express = require("express");
const {
    createService,
    getServices,
    getServicesByBusiness,
    getServiceById,
    updateService,
    deleteService
} = require("../controllers/serviceController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.post("/", createService);
router.get("/", getServices);
router.get("/business/:businessId", getServicesByBusiness);
router.get("/:id", getServiceById);
router.put("/:id", updateService);
router.delete("/:id", deleteService);

module.exports = router;