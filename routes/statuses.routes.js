const { addNewStatus, findAllStatuses, findStatusById, deleteStatusById, updateStatusById } = require("../controllers/statuses.controller");


const router = require("express").Router();

router.post("/", addNewStatus);
router.get("/", findAllStatuses); //userGuard,userAdminGuard,
router.get("/:id", findStatusById); //userGuard, userSelfGuard,
router.delete("/:id", deleteStatusById);
router.put("/:id", updateStatusById);

module.exports = router;
