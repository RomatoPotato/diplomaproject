const router = require("express").Router();
const usersController = require("../controllers/UsersController");

const authMiddleware = require("../middlewares/AuthMiddleware");

router.post("/registration", usersController.registration);
router.post("/login", usersController.login);
router.post("/checkAuth", usersController.checkAuth);
router.post("/logout", usersController.logout);
router.get("/refresh", usersController.refresh);
router.get("/", authMiddleware, usersController.getAllUsers);
router.get("/:id", usersController.getUser);

module.exports = router;