const Joi = require("joi");

exports.statusesValidation = (body) => {
  const schemaStatuses = Joi.object({
    name: Joi.string()
      .max(50)
      .message("name 50 ta harfdan uzun bo'lmasin"),
    description: Joi.string()
  });
  return schemaStatuses.validate(body, {
    abortEarly: false,
  });
};
