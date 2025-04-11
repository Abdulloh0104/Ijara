const { addNewOption, findAllOptions, findOptionById, deleteOptionById, updateOptionById } = require("../controllers/options.controller");

const router = require("express").Router();

router.post("/", addNewOption);
router.get("/", findAllOptions); //userGuard,userAdminGuard,
router.get("/:id", findOptionById); //userGuard, userSelfGuard,
router.delete("/:id", deleteOptionById);
router.put("/:id", updateOptionById);

module.exports = router;
