const Joi = require("joi");

exports.contractsValidation = (body) => {
  const schemaContracts = Joi.object({
    start_date: Joi.date(),
    end_date: Joi.date(),
    receiptPaper: Joi.string(),
    ClientId: Joi.number(),
    StatusId: Joi.number(),
    ProductId: Joi.number(),
    OwnerId: Joi.number(),
  });
  return schemaContracts.validate(body, {
    abortEarly: false,
  });
};
