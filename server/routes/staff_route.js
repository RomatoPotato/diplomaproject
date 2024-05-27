const StaffController = require("../controllers/StaffController");
const router = require("express").Router();

router.get("/", StaffController.getAllStaff);
router.post("/", StaffController.addStaff);
router.delete("/:id", StaffController.deleteStaff);

module.exports = router;