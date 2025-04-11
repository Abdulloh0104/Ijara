const { errorHandler } = require("../helpers/error_handler");
const { contractsValidation } = require("../validations/contracts.validation");
const Contracts = require("../schemas/contracts.model");
const Payments = require("../schemas/payments.model");
const Clients = require("../schemas/clients.model");
const Statuses = require("../schemas/statuses.model");
const Owners = require("../schemas/owners.model");
const Products = require("../schemas/products.model");
const { Op } = require("sequelize");
const { Sequelize } = require("../config/db");

const addNewContract = async (req, res) => {
  try {
    const { error, value } = contractsValidation(req.body);

    if (error) {
      return errorHandler(error, res);
    }
    const {
      start_date,
      end_date,
      receiptPaper,
      ClientId,
      StatusId,
      ProductId,
      OwnerId,
    } = value;
    // console.log(value);
    const newContract = await Contracts.create({
      start_date,
      end_date,
      receiptPaper,
      ClientId,
      StatusId,
      ProductId,
      OwnerId,
    });

    res.status(201).send({ message: "New Contract added", newContract });
  } catch (error) {
    errorHandler(error, res);
  }
};

const findContractByOwnerId = async (req, res) => {
  //--- guartda owner id tokenda olib bajar
  try {
    const contracts = await Contracts
      .findAll
      //     {
      //   include: [ContractDocuments, Companies, PassportDatas, ContractSkills, Jobs],
      //   // attributes: ["type"],
      //   // required: true,
      // }
      ();
    res.status(200).send({ message: "Contracts", contracts });
  } catch (error) {
    errorHandler(error, res);
  }
};
const findContractsByClientId = async (req, res) => {
  // --- guartda client id tokenda olib bajar
  try {
    const contracts = await Contracts.findAll({
      include: [Payments],
    });
    res.status(200).send({ message: "Contracts", contracts });
  } catch (error) {
    errorHandler(error, res);
  }
};
const findAllContracts = async (req, res) => {
  try {
    const contracts = await Contracts.findAll({
      include: [
        { model: Clients, attributes: ["username", "phone_number"] },
        { model: Statuses, attributes: ["name", "description"] },
        { model: Owners, attributes: ["full_name", "phone_number"] },
        { model: Products, attributes: ["name", "description"] },
      ],
    });
    res.status(200).send({ message: "Contracts", contracts });
  } catch (error) {
    errorHandler(error, res);
  }
};

const findContractById = async (req, res) => {
  try {
    const { id } = req.params;
    const contract = await Contracts.findByPk(id, {
      include: [
        { model: Clients, attributes: ["username", "phone_number"] },
        { model: Statuses, attributes: ["name", "description"] },
        { model: Owners, attributes: ["full_name", "phone_number"] },
        { model: Products, attributes: ["name", "description"] },
      ],
    });
    res.status(200).send({ message: "Contracts", contract });
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateContractById = async (req, res) => {
  try {
    const { id } = req.params;
    const { error, value } = contractsValidation(req.body);

    if (error) {
      return errorHandler(error, res);
    }
    const one = await Contracts.findByPk(id);
    const contract = await Contracts.update(
      { ...value, ...one },
      { where: { id }, returning: true }
    );
    console.log(contract[1]);
    res.status(200).send({ Contract: contract[1][0] });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteContractById = async (req, res) => {
  try {
    const { id } = req.params;

    const contract = await Contracts.destroy({ where: { id } });
    res.status(200).send({ contract });
  } catch (error) {
    errorHandler(error, res);
  }
};

// const onPeriod = async (req, res) => {
//   try {
//     const { error, value } = contractsValidation(req.body);

//     if (error) {
//       return errorHandler(error, res);
//     }
//     const { start_date, end_date } = value;
//     const startDate = start_date;
//     const endDate = end_date;
//     const contracts = await Contracts.findAll(
//       {
//         include: [
//           {
//             model: s,
//             attributes: ["username", "phone_number"],
//             where: {
//               start_date: { [Op.lte]: startDate},
//               end_date: { [Op.gte]: endDate } },
//               // StatusId:5
//           },
//           { model: Statuses, attributes: ["name", "description"] },
//           { model: Owners, attributes: ["full_name", "phone_number"] },
//           { model: Products, attributes: ["name", "description"] },
//         ],
//         distinct:true
//       },
//     );
//       // {
//       //   where: { someAttribute: { [Op.between]: [start_date, end_date] } },
//       // }
//     res.status(200).send({
//       message: `${String(start_date).substring(0, 16)}dan ${String(
//         end_date
//       ).substring(0, 16)}gacha ijaraga berilgan mahsulotlar royxati `,
//       contracts,
//     });
//   } catch (error) {
//     errorHandler(error, res);
//   }
// };

// const unusabledByClient = async (req, res) => {
//   try {
//     const { error, value } = contractsValidation(req.body);

//     if (error) {
//       return errorHandler(error, res);
//     }
//     const { start_date, end_date } = value;
    // const contracts = await Contracts.findAll(
    //   {
    //     include: [
    //       { model: Clients, attributes: ["username", "phone_number"] },
    //       { model: Statuses, attributes: ["name", "description"] },
    //       { model: Owners, attributes: ["full_name", "phone_number"] },
    //       { model: Products, attributes: ["name", "description"] },
    //     ],
    //     attributes: ["StatusId"],
    //   },
    //   {
    //     where: {
    //       someAttribute: { [Op.between]: [start_date, end_date] },
    //       StatusId: 5,
    //     },
    //   }
    // );

//     const [clients] = await Sequelize.query(
//       `
//       SELECT DISTINCT cl.*
//       FROM Contracts c
//       JOIN Clients cl ON c.client_id = cl.id
//       WHERE c.start_date <= :start_date
//         AND c.end_date >= :end_date
//         AND c.StatusId = 5
//     `,
//       {
//         replacements: { start_date, end_date },
//       }
//     );

//     res.status(200).send({
//       message: `${String(start_date).substring(0, 16)}dan ${String(
//         end_date
//       ).substring(0, 16)}gacha mahsulotlarni buzib qo'ygan client royxati `,
//       clients,
//     });
//   } catch (error) {
//     errorHandler(error, res);
//   }
// };

module.exports = {
  addNewContract,
  findAllContracts,
  findContractById,
  updateContractById,
  deleteContractById,
  // onPeriod,
  // unusabledByClient,
};
