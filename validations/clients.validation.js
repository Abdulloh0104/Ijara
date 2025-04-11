const Joi = require("joi");

exports.clientsValidation = (body) => {
  const schemaClients = Joi.object({
    username: Joi.string()
      .min(6)
      .message("username 6 ta harfdan kam bo'lmasin")
      .max(50)
      .message("username 50 ta harfdan uzun bo'lmasin")
      .required(),
    first_name: Joi.string()
      .min(3)
      .message("first_name 3 ta harfdan kam bo'lmasin")
      .max(50)
      .message("first_name 50 ta harfdan uzun bo'lmasin")
      .required(),
    last_name: Joi.string()
      .min(3)
      .message("last_name 3 ta harfdan kam bo'lmasin")
      .max(50)
      .message("last_name 50 ta harfdan uzun bo'lmasin"),
    email: Joi.string().email().lowercase().required(),
    phone_number: Joi.string()
      .pattern(/^\d{2}-\d{3}-\d{2}-\d{2}$/)
      .required(),
    frontPassport: Joi.string(),
    backPassport: Joi.string(),
    address: Joi.string(),
    is_active: Joi.boolean().default(false),
    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9!$@#]{6,30}$"))
      .required(),
    confirmation_password: Joi.ref("password"),
    // image: Joi.string().default("/images/avatar.png"),
    refresh_token: Joi.string(),
  });
  return schemaClients.validate(body, {
    abortEarly: false,
  });
};

// const userFullName = (parent) => {
//   return parent.first_name + " " + parent.last_name;
// };
//     full_name: Joi.string().default(userFullName),

// first_name: Joi.string()
//       .min(3)
//       .message(" ta harfdan kam bo'lmasin")
//       .max(20)
//       .message("username 20 ta harfdan uzun bo'lmasin")
//       .required()
//       .messages({
//         "string.empty": "So'z bo'sh bo'lishi mumkin emas",
//         "any.required": "So'zni kirit",
//       }),
