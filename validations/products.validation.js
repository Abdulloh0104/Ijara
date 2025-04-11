const Joi = require("joi");

exports.productsValidation = (body) => {
  const schemaProducts = Joi.object({
    name: Joi.string()
      .max(255)
      .message("name 255 ta harfdan uzun bo'lmasin"),
    is_new: Joi.boolean(),
    is_season: Joi.boolean(),
    description: Joi.string(),
    image_url: Joi.string()
      .max(255)
      .message("image_url 255 ta harfdan uzun bo'lmasin"),
    quantity: Joi.number(),
    OwnerId:Joi.number(),
    OptionId:Joi.number(),
    CategoryId:Joi.number(),
    ClientId:Joi.number()
  });
  return schemaProducts.validate(body, {
    abortEarly: false,
  });
};
