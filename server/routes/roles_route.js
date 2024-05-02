const router = require("express").Router();
const RolesController = require("../controllers/RolesController");

router.get("/", RolesController.getUsersByRoles);
router.post("/", RolesController.addRoleToUser);
router.put("/", RolesController.changeUserRole);
router.delete("/:role/:userId", RolesController.removeRoleFromUser);

module.exports = router;