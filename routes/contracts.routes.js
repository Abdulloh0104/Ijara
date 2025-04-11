const { addNewContract, findAllContracts, findContractById, deleteContractById, updateContractById} = require("../controllers/contracts.controller");
const adminGuard = require("../middleware/guards/admin.guard");
const roleGuard = require("../middleware/guards/role.guard");

const router = require("express").Router();

router.post("/",adminGuard,roleGuard(["admin","creator"]), addNewContract);
// router.post("/owner/:id", addNewContract);//owner uchun --- guartda owner id tokenda olib bajar
// router.post("/client/:id", addNewContract);//client uchun --- guartda client id tokenda olib bajar
router.get("/", findAllContracts); //userGuard,userAdminGuard,
// router.post("/onperiod/",onPeriod)
router.get("/:id",adminGuard,roleGuard(["admin","creator"]), findContractById); //userGuard, userSelfGuard,
router.delete("/:id",adminGuard,roleGuard(["admin","creator"]), deleteContractById);
router.put("/:id",adminGuard,roleGuard(["admin","creator"]), updateContractById);
// router.post("/unusabled/", unusabledByClient);

module.exports = router;
