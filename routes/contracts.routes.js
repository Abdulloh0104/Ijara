const { addNewContract, findAllContracts, findContractById, deleteContractById, updateContractById} = require("../controllers/contracts.controller");

const router = require("express").Router();

router.post("/", addNewContract);
// router.post("/owner/:id", addNewContract);//owner uchun --- guartda owner id tokenda olib bajar
// router.post("/client/:id", addNewContract);//client uchun --- guartda client id tokenda olib bajar
router.get("/", findAllContracts); //userGuard,userAdminGuard,
// router.post("/onperiod/",onPeriod)
router.get("/:id", findContractById); //userGuard, userSelfGuard,
router.delete("/:id", deleteContractById);
router.put("/:id", updateContractById);
// router.post("/unusabled/", unusabledByClient);

module.exports = router;
