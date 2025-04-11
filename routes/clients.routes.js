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
const Guard = require("../middleware/guards/client.guard");

// const userGuard = require("../middleware/guards/user.guard");
// const userSelfGuard = require("../middleware/guards/user.self.guard");

const router = require("express").Router();

router.post("/", addNewClient);
// router.get("/clientcontracts/:id", findAllClientContracts);

router.get("/", findAllClients); //userGuard,userAdminGuard,
router.get("/activate/:link", activateClient);
router.get("/:id", findClientById); //userGuard, userSelfGuard,
router.delete("/:id", deleteClientById);
router.put("/:id", updateClientById);
router.post("/login", loginClient);
router.post("/logout", logoutClient);
router.post("/refresh", refreshTokenClient);
// router.get("/onperiodc", onPeriodC);
// router.get("/search", getAllUsersByClient);
// router.get("/Username/:Username", getByClientName);

module.exports = router;
