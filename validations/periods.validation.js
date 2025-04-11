const Joi = require("joi");

exports.periodsValidation = (body) => {
  const schemaPeriods = Joi.object({
    start_date: Joi.date(),
    end_date: Joi.date(),
  });
  return schemaPeriods.validate(body, {
    abortEarly: false,
  });
};
