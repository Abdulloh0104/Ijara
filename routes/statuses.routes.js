const { addNewStatus, findAllStatuses, findStatusById, deleteStatusById, updateStatusById } = require("../controllers/statuses.controller");
const ownerGuard = require("../middleware/guards/owner.guard");


const router = require("express").Router();

router.post("/",ownerGuard, addNewStatus);
router.get("/", findAllStatuses); //userGuard,userAdminGuard,
router.get("/:id",ownerGuard, findStatusById); //userGuard, userSelfGuard,
router.delete("/:id",ownerGuard, deleteStatusById);
router.put("/:id",ownerGuard, updateStatusById);

module.exports = router;
