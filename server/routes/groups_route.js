const GroupController = require("../controllers/GroupController");
const router = require("express").Router();

router.get("/", GroupController.getAllGroups);
router.get("/:id", GroupController.getGroup);
router.post("/", GroupController.addGroup);
router.put("/", GroupController.editGroup);
router.delete("/:id", GroupController.deleteGroup);
router.put("/:id", GroupController.addStudent);
router.post("/:id", GroupController.deleteStudent);

module.exports = router;