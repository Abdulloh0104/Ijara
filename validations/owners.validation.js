const Joi = require("joi");

exports.ownersValidation = (body) => {
  const schemaOwners = Joi.object({
    full_name: Joi.string()
      .max(100)
      .message("full_rame 100 ta harfdan uzun bo'lmasin"),
    brand: Joi.string()
      .max(100)
      .message("first_name 50 ta harfdan uzun bo'lmasin"),
    phone_number: Joi.string().pattern(/^\d{2}-\d{3}-\d{2}-\d{2}$/),
    email: Joi.string().email().lowercase(),
    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9!$@#]{6,30}$")),
    confirmation_password: Joi.ref("password"),
    address: Joi.string(),
    is_active: Joi.boolean().default(false),
    refresh_token: Joi.string(),
  });
  return schemaOwners.validate(body, {
    abortEarly: false,
  });
};
