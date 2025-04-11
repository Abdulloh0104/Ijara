const { errorHandler } = require("../helpers/error_handler");
const { optionsValidation } = require("../validations/options.validation");
const Options = require("../schemas/options.model");
const Products = require("../schemas/products.model");

const addNewOption = async (req, res) => {
  try {
    const { error, value } = optionsValidation(req.body);

    if (error) {
      return errorHandler(error, res);
    }
    const { name, price, duration } = value;
    // console.log(value);
    const newOption = await Options.create({
      name,
      price,
      duration,
    });
    res.status(201).send({ message: "New Option added", newOption });
  } catch (error) {
    errorHandler(error, res);
  }
};

const findAllOptions = async (req, res) => {
  try {
    const options = await Options.findAll({
      include: [Products],
    });
    res.status(200).send({ message: "Options", options });
  } catch (error) {
    errorHandler(error, res);
  }
};

const findOptionById = async (req, res) => {
  try {
    const { id } = req.params;
    const option = await Options.findByPk(
      id
      //     , {
      //   include: [OptionDocuments, Companies, PassportDatas, OptionSkills],
      //   // attributes: ["type"],
      //   // required: true,
      // }
    );
    res.status(200).send({ message: "Options", option });
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateOptionById = async (req, res) => {
  try {
    const { id } = req.params;
    const { error, value } = optionsValidation(req.body);

    if (error) {
      return errorHandler(error, res);
    }
    const one = await Options.findByPk(id);
    const option = await Options.update(
      { ...value, ...one },
      { where: { id }, returning: true }
    );
    console.log(option[1]);
    res.status(200).send({ Option: option[1][0] });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteOptionById = async (req, res) => {
  try {
    const { id } = req.params;

    const option = await Options.destroy({ where: { id } });
    res.status(200).send({ option });
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  addNewOption,
  findAllOptions,
  findOptionById,
  updateOptionById,
  deleteOptionById,
};
