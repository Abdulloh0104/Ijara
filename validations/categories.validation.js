const Joi = require("joi");

exports.categoriesValidation = (body) => {
  const schemaCategories = Joi.object({
    name: Joi.string().max(50).message("name 50 ta harfdan uzun bo'lmasin"),
    description: Joi.string(),
    image_url: Joi.string(),
  });
  return schemaCategories.validate(body, {
    abortEarly: false,
  });
};
