const { errorHandler } = require("../helpers/error_handler");
const { statusesValidation } = require("../validations/statuses.validation");
const Statuses = require("../schemas/statuses.model");
const Contracts = require("../schemas/contracts.model");

const addNewStatus = async (req, res) => {
  try {
    const { error, value } = statusesValidation(req.body);

    if (error) {
      return errorHandler(error, res);
    }
    const { name, description } = value;
    // console.log(value);
    const newStatus = await Statuses.create({
      name,
      description,
    });

    res.status(201).send({ message: "New Status added", newStatus });
  } catch (error) {
    errorHandler(error, res);
  }
};

const findAllStatuses = async (req, res) => {
  try {
    const statuses = await Statuses.findAll({
      include: [
        { model: Contracts, attributes: ["end_date", "receiptPaper"] },
      ],
    });
    res.status(200).send({ message: "Statuses", statuses });
  } catch (error) {
    errorHandler(error, res);
  }
};

const findStatusById = async (req, res) => {
  try {
    const { id } = req.params;
    const status = await Statuses.findByPk(
      id
      //     , {
      //   include: [StatusDocuments, Companies, PassportDatas, StatusSkills],
      //   // attributes: ["type"],
      //   // required: true,
      // }
    );
    res.status(200).send({ message: "Statuses", status });
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateStatusById = async (req, res) => {
  try {
    const { id } = req.params;
    const { error, value } = statusesValidation(req.body);

    if (error) {
      return errorHandler(error, res);
    }
    const { name, description } = value;
    const one = await Statuses.findByPk(id);
    const status = await Statuses.update(
      { ...value, ...one },
      { where: { id }, returning: true }
    );
    console.log(status[1]);
    // console.log("\n\n[1][1]",status[1][1]);

    res.status(200).send({ Status: status[1][0] });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteStatusById = async (req, res) => {
  try {
    const { id } = req.params;

    const status = await Statuses.destroy({ where: { id } });
    res.status(200).send({ status });
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  addNewStatus,
  findAllStatuses,
  findStatusById,
  updateStatusById,
  deleteStatusById,
};
