const router = require("express").Router();

const clientsRouter = require("./clients.routes");
const statusesRouter = require("./statuses.routes");
const contractsRouter = require("./contracts.routes");
const paymentsRouter = require("./payments.routes");
const productsRouter = require("./products.routes");
const categoriesRouter = require("./categories.routes");
const optionsRouter = require("./options.routes");
const ownersRouter = require("./owners.routes");
const adminsRouter = require("./admins.routes");
const smartRouter = require("./aqlliSorovlar.routes");

router.use("/clients", clientsRouter);
router.use("/statuses", statusesRouter);
router.use("/contracts", contractsRouter);
router.use("/payments", paymentsRouter);
router.use("/products", productsRouter);
router.use("/categories", categoriesRouter);
router.use("/options", optionsRouter);
router.use("/owners", ownersRouter);
router.use("/admins", adminsRouter);
router.use("/smart", smartRouter);

module.exports = router;
