// const userAdminGuard = require("../middleware/guards/user.admin.guard");

const {
  addNewClient,
  findAllClients,
  findClientById,
  deleteClientById,
  updateClientById,
  loginClient,
  logoutClient,
  refreshTokenClient,
  activateClient,
} = require("../controllers/clients.controller");
const adminGuard = require("../middleware/guards/admin.guard");
const Guard = require("../middleware/guards/client.guard");
const creatorGuard = require("../middleware/guards/creator.guard");
const roleGuard = require("../middleware/guards/role.guard");

// const userGuard = require("../middleware/guards/user.guard");
// const userSelfGuard = require("../middleware/guards/user.self.guard");

const router = require("express").Router();

router.post("/", addNewClient);
// router.get("/clientcontracts/:id", findAllClientContracts);

router.get("/",adminGuard,creatorGuard, findAllClients); //userGuard,userAdminGuard,
router.get("/activate/:link", activateClient);
router.get("/:id", adminGuard,roleGuard(["admin","creator"]), findClientById); //userGuard, userSelfGuard,
router.delete(
  "/:id",
  adminGuard,
  roleGuard(["admin", "creator"]),
  deleteClientById
);
router.put(
  "/:id",
  adminGuard,
  roleGuard(["admin", "creator"]),
  updateClientById
);
router.post("/login", loginClient);
router.post("/logout", logoutClient);
router.post("/refresh", refreshTokenClient);
// router.get("/onperiodc", onPeriodC);
// router.get("/search", getAllUsersByClient);
// router.get("/Username/:Username", getByClientName);

module.exports = router;
