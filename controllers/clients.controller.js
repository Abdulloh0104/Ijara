const { errorHandler } = require("../helpers/error_handler");
const bcrypt = require("bcrypt");
const config = require("config");
const { clientsValidation } = require("../validations/clients.validation");
const jwtService = require("../services/jwt.client.service");
const Clients = require("../schemas/clients.model");
const Payments = require("../schemas/payments.model");
const Contracts = require("../schemas/contracts.model");
const Products = require("../schemas/products.model");
const uuid = require("uuid");
const mailService = require("../services/mail.service");
const { Op } = require("sequelize");


const addNewClient = async (req, res) => {
  try {
    const { error, value } = clientsValidation(req.body);

    if (error) {
      return errorHandler(error, res);
    }
    const {
      username,
      first_name,
      last_name,
      phone_number,
      email,
      frontPassport,
      backPassport,
      address,
      is_active,
      password,
    } = value;

    const existingClient = await Clients.findOne({
      where: {
        [Op.or]: [{ email }, { phone_number }],
      },
    });

    if (existingClient) {
      return res
        .status(400)
        .send({ error: "client Phone yoki email alaqachon mavjud" });
    }

    const activation_link = uuid.v4();
    // console.log(value);
    const hashedPassword = bcrypt.hashSync(password, 7);
    const newClient = await Clients.create({
      username,
      first_name,
      last_name,
      phone_number,
      email,
      frontPassport,
      backPassport,
      address,
      is_active,
      password: hashedPassword,
      activation_link,
    });

    await mailService.sendActivationMail(
      newClient.email,
      `${config.get("api_url")}/api/clients/activate/${activation_link}`
    );
    res
      .status(201)
      .send({
        message:
          "Yangi foydalanuvchi(owner) qo'shildi. Akkountni faollashtirish uchun pochtaga o'ting",
        newClient,
      });
  } catch (error) {
    errorHandler(error, res);
  }
};

const findAllClients = async (req, res) => {
  try {
    const clients = await Clients.findAll({
      include: [
        { model: Payments, attributes: ["amount", "date"] },
        { model: Contracts, attributes: ["end_date", "receiptPaper"] },
        { model: Products, attributes: ["name", "description"] },
      ],
      // attributes: ["username"],
      //   // required: true,
    });
    res.status(200).send({ message: "Clients", clients });
  } catch (error) {
    errorHandler(error, res);
  }
};
// const findOwnersContractByContractId = async (req, res) => { owner contrallers

const findClientsContractByContractId = async (req, res) => {
  try {
    const clients = await Clients
      .findAll
      //     {
      //   include: [ClientDocuments, Companies, PassportDatas, ClientSkills, Jobs],
      //   // attributes: ["type"],
      //   // required: true,
      // }
      ();
    res.status(200).send({ message: "Clients", clients });
  } catch (error) {
    errorHandler(error, res);
  }
};

const findClientById = async (req, res) => {
  try {
    const { id } = req.params;
    const client = await Clients.findByPk(
      id
      //     , {
      //   include: [ClientDocuments, Companies, PassportDatas, ClientSkills],
      //   // attributes: ["type"],
      //   // required: true,
      // }
    );
    res.status(200).send({ message: "Clients", client });
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateClientById = async (req, res) => {
  try {
    const { id } = req.params;
    const { error, value } = clientsValidation(req.body);

    if (error) {
      return errorHandler(error, res);
    }
    const {
      username,
      first_name,
      last_name,
      phone_number,
      email,
      frontPassport,
      backPassport,
      address,
      is_active,
      password,
      confirmation_password,
    } = value;

    const client = await Clients.update(
      {
        username,
        first_name,
        last_name,
        phone_number,
        email,
        frontPassport,
        backPassport,
        address,
        is_active,
        password,
        confirmation_password,
      },
      { where: { id }, returning: true }
    );
    res.status(200).send({ Client: client[1][0] });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteClientById = async (req, res) => {
  try {
    const { id } = req.params;

    const client = await Clients.destroy({ where: { id } });
    res.status(200).send({ client });
  } catch (error) {
    errorHandler(error, res);
  }
};

const loginClient = async (req, res) => {
  try {
    const { email, password } = req.body;
    const client = await Clients.findOne({ where: { email } });
    // console.log(client, email, password);

    if (!client) {
      return res.status(404).send("Client not found");
    }
    const validPassword = bcrypt.compare(password, client.password);
    if (!validPassword) {
      return res.status(400).send("Password Error");
    }
    const payload = {
      id: client.id,
      email: client.email,
      role: "client",
    };
    const { accessToken, refreshToken } = jwtService.generateTokens(payload);
    client.refresh_token = refreshToken;
    await client.save();

    res.cookie("refreshToken", refreshToken, {
      maxAge: config.get("refresh_cookie_time"),
      httpOnly: true,
    });

    res.status(200).send({
      message: "Login",
      accessToken: accessToken,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const logoutClient = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res.status(400).send("Refresh token not found");
    }
    const client = await Clients.findOne({
      where: { refresh_token: refreshToken },
    });
    if (!client) {
      return res.status(404).send("Client not found");
    }
    client.refresh_token = null;
    await client.save();
    res.clearCookie("refreshToken");
    res
      .status(200)
      .send({ message: "Client logged out seccessfully", id: client.id });
  } catch (error) {
    errorHandler(error, res);
  }
};

const refreshTokenClient = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    // console.log(refreshToken);
    if (!refreshToken) {
      return res
        .status(400)
        .send({ message: "Cookieda refresh token topilmadi" });
    }
    // console.log(1);
    const decodedRefreshToken = await jwtService.verifyRefreshToken(
      refreshToken
    );
    const client = await Clients.findOne({
      where: { refresh_token: refreshToken },
    });
    // console.log(client);

    if (!client) {
      return res
        .status(400)
        .send({ message: "Bunday tokenli foydalanuvchi topilmadi" });
    }
    // console.log(2);
    const payload = {
      id: client.id,
      email: client.email,
      role: "client",
    };
    const tokens = jwtService.generateTokens(payload);
    // console.log(3);
    client.refresh_token = tokens.refreshToken;
    await client.save();
    // console.log(10);
    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: config.get("refresh_cookie_time"),
    });
    // console.log(4);
    res.send({
      message: "Tokenlar yangilandi",
      accessToken: tokens.accessToken,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const activateClient = async (req, res) => {
  try {

    const client = await Clients.findOne({
      where: { activation_link: req.params.link },
    });

    if (!client) {
      return res
        .status(400)
        .send({ message: "Bunday foydalanuvchi topilmadi" });
    }

    client.is_active = true;
    client.activation_link = null;

    await client.save();
    res.send({
      message: "Foydalanuvchi faollashtirildi",
      status: client.is_active,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  addNewClient,
  findAllClients,
  findClientById,
  updateClientById,
  deleteClientById,
  loginClient,
  logoutClient,
  refreshTokenClient,
  activateClient,
};
