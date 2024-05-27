const TeacherController = require("../controllers/TeacherController");
const router = require("express").Router();

router.get("/", TeacherController.getAllTeachers);
router.post("/", TeacherController.addTeacher);
router.delete("/:id", TeacherController.deleteTeacher);

module.exports = router;