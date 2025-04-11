const { addNewPayment, findAllPayments, findPaymentById, deletePaymentById, updatePaymentById } = require("../controllers/payments.controller");

const router = require("express").Router();

router.post("/", addNewPayment);
router.get("/", findAllPayments); //userGuard,userAdminGuard,
router.get("/:id", findPaymentById); //userGuard, userSelfGuard,
router.delete("/:id", deletePaymentById);
router.put("/:id", updatePaymentById);

module.exports = router;
