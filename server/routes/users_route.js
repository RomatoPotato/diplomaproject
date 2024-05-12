const router = require("express").Router();
const usersController = require("../controllers/UserController");

//const authMiddleware = require("../middlewares/AuthMiddleware");

router.post("/login", usersController.login);
router.post("/checkAuth", usersController.checkAuth);
router.post("/logout", usersController.logout);
router.get("/refresh", usersController.refresh);
router.get("/:login", usersController.getUser);
router.post("/", usersController.addUserWithRoles);
router.post("/updateLoginData", usersController.updateLoginData);
router.post("/generate", usersController.generateLoginsAndPasswords);

module.exports = router;