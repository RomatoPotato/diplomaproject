const router = require("express").Router();
const ChatController = require("../controllers/ChatController");

router.post("/", ChatController.createChat);
router.get("/:userId", ChatController.getChats);
router.get("/messages/:chatId", ChatController.getMessages);
router.post("/messages/", ChatController.saveMessage);

module.exports = router;