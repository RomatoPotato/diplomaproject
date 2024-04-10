/*
    Educational Institute Route - маршрут образовательного учреждения
 */
const EIController = require("../controllers/EIController");
const router = require("express").Router();

const specialtiesRoute = "/specialties";
const groupsRoute = "/groups";
const vlssRoute = "/vlss";

router.get(specialtiesRoute, EIController.getAllSpecialties);
router.post(specialtiesRoute, EIController.addSpecialty);
router.put(specialtiesRoute, EIController.editSpecialty);
router.delete(`${specialtiesRoute}/:id`, EIController.deleteSpecialty);

router.get(groupsRoute, EIController.getAllGroups);
router.post(groupsRoute, EIController.addGroup);
router.put(groupsRoute, EIController.editGroup);
router.delete(`${groupsRoute}/:id`, EIController.deleteGroup);

router.get(vlssRoute, EIController.getAllVLSs);
router.post(vlssRoute, EIController.addVLS);
router.put(vlssRoute, EIController.editVLS);
router.delete(`${vlssRoute}/:id`, EIController.deleteVLS);

router.get("/generatePasswords/:id", EIController.generatePasswords);

module.exports = router;