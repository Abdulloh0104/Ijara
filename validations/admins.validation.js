const Joi = require("joi");

exports.adminsValidation = (body) => {
  const schemaAdmins = Joi.object({
    username: Joi.string()
      .max(50)
      .message("first_name 50 ta harfdan uzun bo'lmasin"),
    full_name: Joi.string()
      .max(100)
      .message("username 100 ta harfdan uzun bo'lmasin"),
    phone_number: Joi.string()
      .pattern(/^\d{2}-\d{3}-\d{2}-\d{2}$/),
    email: Joi.string().email().lowercase(),
    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9!$@#]{6,30}$")),
    confirmation_password: Joi.ref("password"),
    is_active: Joi.boolean().default(false),
    is_creator: Joi.boolean().default(false),
    refresh_token: Joi.string(),
  });
  return schemaAdmins.validate(body, {
    abortEarly: false,
  });
};

