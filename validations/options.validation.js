const Joi = require("joi");

exports.optionsValidation = (body) => {
  const schemaOptions = Joi.object({
    name: Joi.string().max(50).message("name 50 ta harfdan uzun bo'lmasin"),
    price: Joi.number(),
    duration: Joi.string(),
  });
  return schemaOptions.validate(body, {
    abortEarly: false,
  });
};
