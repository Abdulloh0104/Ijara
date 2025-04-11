const { errorHandler } = require("../helpers/error_handler");
const Categories = require("../schemas/categories.model");
const Clients = require("../schemas/clients.model");
const Contracts = require("../schemas/contracts.model");
const Options = require("../schemas/options.model");
const Owners = require("../schemas/owners.model");
const Products = require("../schemas/products.model");
const { productsValidation } = require("../validations/products.validation");

const addNewProduct = async (req, res) => {
  try {
    const { error, value } = productsValidation(req.body);

    if (error) {
      return errorHandler(error, res);
    }
    // console.log(value);
    const newProduct = await Products.create(value);

    res.status(201).send({ message: "New Product added", newProduct });
  } catch (error) {
    errorHandler(error, res);
  }
};

const findAllProducts = async (req, res) => {
  try {
    const products = await Products.findAll({
      include: [
        { model: Contracts, attributes: ["end_date", "receiptPaper"] },
        { model: Owners, attributes: ["full_name", "phone_number"] },
        { model: Clients, attributes: ["username", "phone_number"] },
        Options,
        Categories,
      ],
    });
    res.status(200).send({ message: "Products", products });
  } catch (error) {
    errorHandler(error, res);
  }
};

const findProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Products.findByPk(
      id
      //     , {
      //   include: [ProductDocuments, Companies, PassportDatas, ProductSkills],
      //   // attributes: ["type"],
      //   // required: true,
      // }
    );
    res.status(200).send({ message: "Products", product });
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const { error, value } = productsValidation(req.body);

    if (error) {
      return errorHandler(error, res);
    }
    const one = await Products.findByPk(id);
    const product = await Products.update(
      { ...value, ...one },
      { where: { id }, returning: true }
    );
    res.status(200).send({ Product: product[1][0] });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Products.destroy({ where: { id } });
    res.status(200).send({ product });
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  addNewProduct,
  findAllProducts,
  findProductById,
  updateProductById,
  deleteProductById,
};
