const GroupController = require("../controllers/GroupController");
const router = require("express").Router();

router.get("/", GroupController.getAllGroups);
router.get("/:id", GroupController.getGroup);
router.post("/", GroupController.addGroup);
router.put("/", GroupController.editGroup);
router.delete("/:id", GroupController.deleteGroup);

module.exports = router;