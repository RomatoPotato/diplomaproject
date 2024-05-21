const router = require("express").Router();
const MessagesController = require("../controllers/MessagesController");

router.get("/:chatId", MessagesController.getMessages);
router.post("/", MessagesController.saveMessage);
router.post("/many", MessagesController.saveManyMessages);
router.put("/", MessagesController.editMessage);
router.post("/delete-one/all", MessagesController.deleteMessageForAll);
router.post("/delete-one/self", MessagesController.deleteMessageForSelf);
router.post("/delete-many/all", MessagesController.deleteManyMessagesForAll);
router.post("/delete-many/self", MessagesController.deleteManyMessagesForSelf);

module.exports = router;