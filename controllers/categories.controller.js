const { errorHandler } = require("../helpers/error_handler");
const { categoriesValidation } = require("../validations/categories.validation");
const Categories = require("../schemas/categories.model");
const Products = require("../schemas/products.model");

const addNewCategory = async (req, res) => {
  try {
    const { error, value } = categoriesValidation(req.body);

    if (error) {
      return errorHandler(error, res);
    }
    const { name,description,image_url } = value;
    // console.log(value);
    const newCategory = await Categories.create({
      name,
      description,
      image_url,
    });

    res.status(201).send({ message: "New Category added", newCategory });
  } catch (error) {
    errorHandler(error, res);
  }
};

const findAllCategories = async (req, res) => {
  try {
    const categories = await Categories
      .findAll(
          {
        include: [Products],
      //   // attributes: ["type"],
      //   // required: true,
      }
      );
    res.status(200).send({ message: "Categories", categories });
  } catch (error) {
    errorHandler(error, res);
  }
};

const findCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Categories.findByPk(
      id
      //     , {
      //   include: [CategoryDocuments, Companies, PassportDatas, CategorySkills],
      //   // attributes: ["type"],
      //   // required: true,
      // }
    );
    res.status(200).send({ message: "Categories",category });
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const { error, value } = categoriesValidation(req.body);

    if (error) {
      return errorHandler(error, res);
    }
    const one = await Categories.findByPk(id);
    const category = await Categories.update(
      { ...value, ...one },
      { where: { id }, returning: true }
    );
    console.log(category[1]);
    res.status(200).send({ Category: category[1][0] });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Categories.destroy({ where: { id } });
    res.status(200).send({ category });
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  addNewCategory,
  findAllCategories,
  findCategoryById,
  updateCategoryById,
  deleteCategoryById,
};
