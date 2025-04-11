const Joi = require("joi");

exports.paymentsValidation = (body) => {
  const schemaPayments = Joi.object({
    amount: Joi.number(),
    date: Joi.date(),
    ClientId:Joi.number(),
    ContractId:Joi.number(),
  });
  return schemaPayments.validate(body, {
    abortEarly: false,
  });
};

