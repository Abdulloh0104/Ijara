const { addNewPayment, findAllPayments, findPaymentById, deletePaymentById, updatePaymentById } = require("../controllers/payments.controller");
const adminGuard = require("../middleware/guards/admin.guard");

const router = require("express").Router();

router.post("/",adminGuard, addNewPayment);
router.get("/",adminGuard, findAllPayments); //userGuard,userAdminGuard,
router.get("/:id",adminGuard, findPaymentById); //userGuard, userSelfGuard,
router.delete("/:id",adminGuard, deletePaymentById);
router.put("/:id",adminGuard, updatePaymentById);

module.exports = router;
