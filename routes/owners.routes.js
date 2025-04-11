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
const adminGuard = require("../middleware/guards/admin.guard");
const ownerGuard = require("../middleware/guards/owner.guard");
const userSelfGuard = require("../middleware/guards/user.self.guard");


const router = require("express").Router();

router.post("/", addNewOwner);

router.get("/",adminGuard, findAllOwners); //userGuard,userAdminGuard,
router.get("/:id",ownerGuard,userSelfGuard, findOwnerById); //userGuard, userSelfGuard,
router.get("/activate/:link", activateOwner);
router.delete("/:id",adminGuard, deleteOwnerById);
router.put("/:id",adminGuard, updateOwnerById);
router.post("/login", loginOwner);
router.post("/logout", logoutOwner);
router.post("/refresh", refreshTokenOwner);

module.exports = router;

// router.get("/ownercontracts/:id", findAllOwnerContracts);