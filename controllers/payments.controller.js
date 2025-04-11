const { errorHandler } = require("../helpers/error_handler");
const { paymentsValidation } = require("../validations/payments.validation");
const Payments = require("../schemas/payments.model");
const Clients = require("../schemas/clients.model");
const Contracts = require("../schemas/contracts.model");

const addNewPayment = async (req, res) => {
  try {
    const { error, value } = paymentsValidation(req.body);

    if (error) {
      return errorHandler(error, res);
    }
    const { amount,date,ClientId,ContractId } = value;
    // console.log(value);
    const newPayment = await Payments.create({
      amount,
      date,
      ClientId,
      ContractId,
    });

    res.status(201).send({ message: "New Payment added", newPayment });
  } catch (error) {
    errorHandler(error, res);
  }
};

const findAllPayments = async (req, res) => {
  try {
    const payments = await Payments.findAll({
      include: [
        { model: Clients, attributes: ["username", "phone_number"] },
        { model: Contracts, attributes: ["end_date", "receiptPaper"] },
      ],
      //   // attributes: ["type"],
      //   // required: true,
    });
    res.status(200).send({ message: "Payments", payments });
  } catch (error) {
    errorHandler(error, res);
  }
};

const findPaymentById = async (req, res) => {
  try {
    const { id } = req.params;
    const payment = await Payments.findByPk(
      id
          // , {
      //   include: [PaymentDocuments, Companies, PassportDatas, PaymentSkills],
      //   // attributes: ["type"],
      //   // required: true,
      // }
    );
    res.status(200).send({ message: "Payments",payment });
  } catch (error) {
    errorHandler(error, res);
  }
};

const updatePaymentById = async (req, res) => {
  try {
    const { id } = req.params;
    const { error, value } = paymentsValidation(req.body);

    if (error) {
      return errorHandler(error, res);
    }
    const one = await Payments.findByPk(id);
    const payment = await Payments.update(
      { ...value, ...one },
      { where: { id }, returning: true }
    );
    // console.log(payment[1]);
    res.status(200).send({ Payment: payment[1][0] });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deletePaymentById = async (req, res) => {
  try {
    const { id } = req.params;

    const payment = await Payments.destroy({ where: { id } });
    res.status(200).send({ payment });
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  addNewPayment,
  findAllPayments,
  findPaymentById,
  updatePaymentById,
  deletePaymentById,
};
