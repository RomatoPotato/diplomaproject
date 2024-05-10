const router = require("express").Router();
const MessagesController = require("../controllers/MessagesController");

router.get("/:chatId", MessagesController.getMessages);
router.post("/", MessagesController.saveMessage);
router.put("/", MessagesController.editMessage);
router.delete("/:messageId", MessagesController.deleteMessage);

module.exports = router;