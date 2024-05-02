const StaffController = require("../controllers/StaffController");
const router = require("express").Router();

router.get("/", StaffController.getAllStaff);
router.post("/", StaffController.addStaff);

module.exports = router;