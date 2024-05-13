const router = require("express").Router();
const MessagesController = require("../controllers/MessagesController");

router.get("/:chatId", MessagesController.getMessages);
router.post("/", MessagesController.saveMessage);
router.put("/", MessagesController.editMessage);
router.delete("/:messageId", MessagesController.deleteMessageForAll);
router.post("/:userId", MessagesController.deleteMessageForSelf);

module.exports = router;