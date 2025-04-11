// const userAdminGuard = require("../middleware/guards/user.admin.guard");

const {
  addNewOwner,
  findAllOwners,
  findOwnerById,
  deleteOwnerById,
  updateOwnerById,
  loginOwner,
  logoutOwner,
  refreshTokenOwner,
  activateOwner,
} = require("../controllers/owners.controller");
const Guard = require("../middleware/guards/client.guard");
const userSelfGuard = require("../middleware/guards/user.self.guard");

// const userGuard = require("../middleware/guards/user.guard");
// const userSelfGuard = require("../middleware/guards/user.self.guard");

const router = require("express").Router();

router.post("/", addNewOwner);
// router.get("/ownercontracts/:id", findAllOwnerContracts);

router.get("/", findAllOwners); //userGuard,userAdminGuard,
// router.get("/activate/:link", activateUser);
router.get("/:id", findOwnerById); //userGuard, userSelfGuard,
router.get("/activate/:link", activateOwner);
router.delete("/:id", deleteOwnerById);
router.put("/:id", updateOwnerById);
router.post("/login", loginOwner);
router.post("/logout", logoutOwner);
router.post("/refresh", refreshTokenOwner);
// router.get("/search", getAllUsersByOwner);
// router.get("/Username/:Username", getByOwnerName);

module.exports = router;
