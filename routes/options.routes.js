const { addNewOption, findAllOptions, findOptionById, deleteOptionById, updateOptionById } = require("../controllers/options.controller");
const ownerGuard = require("../middleware/guards/owner.guard");

const router = require("express").Router();

router.post("/",ownerGuard, addNewOption);
router.get("/", findAllOptions); //userGuard,userAdminGuard,
router.get("/:id", ownerGuard, findOptionById); //userGuard, userSelfGuard,
router.delete("/:id", ownerGuard, deleteOptionById);
router.put("/:id", ownerGuard, updateOptionById);

module.exports = router;
