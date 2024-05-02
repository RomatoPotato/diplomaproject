const SpecialtyController = require("../controllers/SpecialtyController");
const router = require("express").Router();

router.get("/", SpecialtyController.getAllSpecialties);
router.post("/", SpecialtyController.addSpecialty);
router.put("/", SpecialtyController.editSpecialty);
router.delete("/:id", SpecialtyController.deleteSpecialty);

module.exports = router;