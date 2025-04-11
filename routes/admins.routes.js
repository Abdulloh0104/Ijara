// const userAdminGuard = require("../middleware/guards/user.admin.guard");

const {
  addNewAdmin,
  findAllAdmins,
  findAdminById,
  deleteAdminById,
  updateAdminById,
  loginAdmin,
  logoutAdmin,
  refreshTokenAdmin,
} = require("../controllers/admins.controller");
const adminGuard = require("../middleware/guards/admin.guard");
const creatorGuard = require("../middleware/guards/creator.guard");
const roleGuard = require("../middleware/guards/role.guard");
const userSelfGuard = require("../middleware/guards/user.self.guard");

const router = require("express").Router();

router.post("/",addNewAdmin);

router.get("/",adminGuard,creatorGuard,findAllAdmins);
// router.get("/activate/:link", activateUser);
router.get("/:id", adminGuard, userSelfGuard, findAdminById); // userSelfGuard,
router.delete("/:id", adminGuard, creatorGuard, deleteAdminById);
router.put("/:id", adminGuard, roleGuard(["admin","creator"]), updateAdminById);
router.post("/login", loginAdmin);
router.post("/logout", logoutAdmin);
router.post("/refresh", refreshTokenAdmin);
// router.get("/search", getAllUsersByClient);
// router.get("/Username/:Username", getByClientName);

module.exports = router;
