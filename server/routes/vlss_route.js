const VLSController = require("../controllers/VLSController");
const router = require("express").Router();

router.get("/", VLSController.getAllVLSs);
router.get("/:id", VLSController.getVLS);
router.post("/", VLSController.addVLS);
router.put("/", VLSController.editVLS);
router.delete("/:id", VLSController.deleteVLS);
router.post("/studyChats", VLSController.addStudyChats);

module.exports = router;