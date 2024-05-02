const CurriculumController = require("../controllers/CurriculumController");
const router = require("express").Router();

router.get("/", CurriculumController.getAllCurriculums);
router.get("/:groupId", CurriculumController.getCurriculum);
router.get("/check/:groupId", CurriculumController.checkCurriculum);
router.post("/", CurriculumController.addCurriculum);
router.put("/", CurriculumController.editCurriculum);
router.delete("/:id", CurriculumController.deleteCurriculum);

module.exports = router;