const TeacherController = require("../controllers/TeacherController");
const router = require("express").Router();

router.get("/", TeacherController.getAllTeachers);
router.post("/", TeacherController.addTeacher);

module.exports = router;