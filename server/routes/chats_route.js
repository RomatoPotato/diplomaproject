const router = require("express").Router();
const ChatController = require("../controllers/ChatController");

router.get("/:userId", ChatController.getChats);
router.post("/", ChatController.createChat);

module.exports = router;