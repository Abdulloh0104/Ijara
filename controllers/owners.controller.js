const { errorHandler } = require("../helpers/error_handler");
const bcrypt = require("bcrypt");
const config = require("config");
const { ownersValidation } = require("../validations/owners.validation");
const jwtService = require("../services/jwt.owner.service");
const Owners = require("../schemas/owners.model");
const Contracts = require("../schemas/contracts.model");
const Products = require("../schemas/products.model");
const uuid = require("uuid");
const { Op } = require("sequelize");
const mailService = require("../services/mail.service");


const addNewOwner = async (req, res) => {
  try {
    const { error, value } = ownersValidation(req.body);

    if (error) {
      return errorHandler(error, res);
    }
    const {
      full_name,
      brand,
      phone_number,
      email,
      password,
      address,
      is_active,
    } = value;

    const existingOwner = await Owners.findOne({
      where: {
        [Op.or]: [{ email }, { phone_number }],
      },
    });

    if (existingOwner) {
      return res
        .status(400)
        .send({ error: "Owner Phone yoki email alaqachon mavjud" });
    }

    const activation_link = uuid.v4();
console.log(activation_link);
    const hashedPassword = bcrypt.hashSync(password, 7);
    const newOwner = await Owners.create({
      full_name,
      brand,
      phone_number,
      email,
      password:hashedPassword,
      address,
      is_active,
      activation_link,
    });

    await mailService.sendActivationMail(
          newOwner.email,
          `${config.get("api_url")}/api/owners/activate/${activation_link}`
        );
        res
          .status(201)
          .send({
            message:
              "Yangi foydalanuvchi(client) qo'shildi. Akkountni faollashtirish uchun pochtaga o'ting",
            newOwner
          });
  } catch (error) {
    errorHandler(error, res);
  }
};

const findAllOwners = async (req, res) => {
  try {
    const owners = await Owners.findAll({
      include: [
        { model: Contracts, attributes: ["end_date", "receiptPaper"] },
        { model: Products, attributes: ["name", "quantity"] },
      ],
    });
    res.status(200).send({ message: "Owners", owners });
  } catch (error) {
    errorHandler(error, res);
  }
};
// const findOwnersContractByContractId = async (req, res) => { owner contrallers

const findOwnersContractByContractId = async (req, res) => {
  try {
    const owners = await Owners
      .findAll
      //     {
      //   include: [OwnerDocuments, Companies, PassportDatas, OwnerSkills, Jobs],
      //   // attributes: ["type"],
      //   // required: true,
      // }
      ();
    res.status(200).send({ message: "Owners", owners });
  } catch (error) {
    errorHandler(error, res);
  }
};

const findOwnerById = async (req, res) => {
  try {
    const { id } = req.params;
    const owner = await Owners.findByPk(
      id
      //     , {
      //   include: [OwnerDocuments, Companies, PassportDatas, OwnerSkills],
      //   // attributes: ["type"],
      //   // required: true,
      // }
    );
    res.status(200).send({ message: "Owners", owner });
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateOwnerById = async (req, res) => {
  try {
    const { id } = req.params;
    const { error, value } = ownersValidation(req.body);

    if (error) {
      return errorHandler(error, res);
    }
    const one = await Owners.findByPk(id);

    const owner = await Owners.update(
      { ...value, ...one },
      { where: { id }, returning: true }
    );
    res.status(200).send({ Owner: owner[1][0] });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteOwnerById = async (req, res) => {
  try {
    const { id } = req.params;

    const owner = await Owners.destroy({ where: { id } });
    res.status(200).send({ owner });
  } catch (error) {
    errorHandler(error, res);
  }
};

const loginOwner = async (req, res) => {
  try {
    const { email, password } = req.body;
    const owner = await Owners.findOne({ where: { email } });
    // console.log(owner, email, password);

    if (!owner) {
      return res.status(404).send("Owner not found");
    }
    const validPassword = bcrypt.compare(password, owner.password);
    if (!validPassword) {
      return res.status(400).send("Password Error");
    }
    const payload = {
      id: owner.id,
      email: owner.email,
      role: "owner",
    };
    const { accessToken, refreshToken } = jwtService.generateTokens(payload);
    owner.refresh_token = refreshToken;
    await owner.save();

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

const logoutOwner = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res.status(400).send("Refresh token not found");
    }
    const owner = await Owners.findOne({
      where: { refresh_token: refreshToken },
    });
    if (!owner) {
      return res.status(404).send("Owner not found");
    }
    owner.refresh_token = null;
    await owner.save();
    res.clearCookie("refreshToken");
    res
      .status(200)
      .send({ message: "Owner logged out seccessfully", id: owner.id });
  } catch (error) {
    errorHandler(error, res);
  }
};

const refreshTokenOwner = async (req, res) => {
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
    const owner = await Owners.findOne({
      where: { refresh_token: refreshToken },
    });
    // console.log(owner);

    if (!owner) {
      return res
        .status(400)
        .send({ message: "Bunday tokenli foydalanuvchi topilmadi" });
    }
    // console.log(2);
    const payload = {
      id: owner.id,
      email: owner.email,
      role: "owner",
    };
    const tokens = jwtService.generateTokens(payload);
    // console.log(3);
    owner.refresh_token = tokens.refreshToken;
    await owner.save();
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

const activateOwner = async (req, res) => {
  try {

    const owner= await Owners.findOne({
      where: { activation_link: req.params.link },
    });

    if (!owner) {
      return res
        .status(400)
        .send({ message: "Bunday foydalanuvchi topilmadi" });
    }

    owner.is_active = true;
    owner.activation_link = null;

    await owner.save();
    res.send({
      message: "Foydalanuvchi faollashtirildi",
      status: owner.is_active,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  addNewOwner,
  findAllOwners,
  findOwnerById,
  updateOwnerById,
  deleteOwnerById,
  loginOwner,
  logoutOwner,
  refreshTokenOwner,
  activateOwner
};
