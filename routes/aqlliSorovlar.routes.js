const { getRentedProductsByDate, getDamagedProductsClients, getCancelledContractsClients, getTopOwnersCategory, getClientPayments } = require("../controllers/aqlliSorovlar.controller");

const router = require("express").Router();


router.post("/productbydate", getRentedProductsByDate); //userGuard,userAdminGuard,
router.post("/damaged", getDamagedProductsClients);
router.post("/cancelled", getCancelledContractsClients); //userGuard, userSelfGuard,
router.get("/topowner/:id", getTopOwnersCategory);
router.post("/payment", getClientPayments);

module.exports = router;
