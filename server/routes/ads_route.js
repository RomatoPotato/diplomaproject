const ADController = require("../controllers/ADController");
const router = require("express").Router();

router.get("/", ADController.getAcademicDisciplines);
router.post("/", ADController.addAcademicDiscipline);
router.put("/", ADController.editAcademicDiscipline);
router.delete("/:id", ADController.deleteAcademicDiscipline);

module.exports = router;