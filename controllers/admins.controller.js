const { errorHandler } = require("../helpers/error_handler");
const bcrypt = require("bcrypt");
const config = require("config");
const { adminsValidation } = require("../validations/admins.validation");
const jwtService = require("../services/jwt.admin.service");
const Admins = require("../schemas/admins.model");

const addNewAdmin = async (req, res) => {
  try {
    const { error, value } = adminsValidation(req.body);

    if (error) {
      return errorHandler(error, res);
    }
    const { username, full_name, phone_number, email, is_active, password } =
      value;
    // console.log(value);
    const hashedPassword = bcrypt.hashSync(password, 7);
    const newAdmin = await Admins.create({
      username,
      full_name,
      phone_number,
      email,
      is_active,
      password: hashedPassword,
    });

    res.status(201).send({ message: "New Admin added", newAdmin });
  } catch (error) {
    errorHandler(error, res);
  }
};

const findAllAdmins = async (req, res) => {
  try {
    const admins = await Admins
      .findAll
      //     {
      //   include: [AdminDocuments, Companies, PassportDatas, AdminSkills, Jobs],
      //   // attributes: ["type"],
      //   // required: true,
      // }
      ();
    res.status(200).send({ message: "Admins", admins });
  } catch (error) {
    errorHandler(error, res);
  }
};
// const findOwnersContractByContractId = async (req, res) => { owner contrallers

const findAdminsContractByContractId = async (req, res) => {
  try {
    const admins = await Admins
      .findAll
      //     {
      //   include: [AdminDocuments, Companies, PassportDatas, AdminSkills, Jobs],
      //   // attributes: ["type"],
      //   // required: true,
      // }
      ();
    res.status(200).send({ message: "Admins", admins });
  } catch (error) {
    errorHandler(error, res);
  }
};

const findAdminById = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await Admins.findByPk(
      id
      //     , {
      //   include: [AdminDocuments, Companies, PassportDatas, AdminSkills],
      //   // attributes: ["type"],
      //   // required: true,
      // }
    );
    res.status(200).send({ message: "Admins", admin });
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateAdminById = async (req, res) => {
  try {
    const { id } = req.params;
    const { error, value } = adminsValidation(req.body);

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

    const admin = await Admins.update(
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
    res.status(200).send({ Admin: admin[1][0] });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteAdminById = async (req, res) => {
  try {
    const { id } = req.params;

    const admin = await Admins.destroy({ where: { id } });
    res.status(200).send({ admin });
  } catch (error) {
    errorHandler(error, res);
  }
};

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admins.findOne({ where: { email } });
    // console.log(admin, email, password);

    if (!admin) {
      return res.status(404).send("Admin not found");
    }
    const validPassword = bcrypt.compare(password, admin.password);
    if (!validPassword) {
      return res.status(400).send("Password Error");
    }
    const payload = {
      id: admin.id,
      email: admin.email,
      role: "admin",
    };
    if (admin.is_creator) {
      payload.role = "creator";
    }
    const { accessToken, refreshToken } = jwtService.generateTokens(payload);
    admin.refresh_token = refreshToken;
    await admin.save();

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

const logoutAdmin = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res.status(400).send("Refresh token not found");
    }
    const admin = await Admins.findOne({
      where: { refresh_token: refreshToken },
    });
    if (!admin) {
      return res.status(404).send("Admin not found");
    }
    admin.refresh_token = null;
    await admin.save();
    res.clearCookie("refreshToken");
    res
      .status(200)
      .send({ message: "Admin logged out seccessfully", id: admin.id });
  } catch (error) {
    errorHandler(error, res);
  }
};

const refreshTokenAdmin = async (req, res) => {
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
    const admin = await Admins.findOne({
      where: { refresh_token: refreshToken },
    });
    // console.log(admin);

    if (!admin) {
      return res
        .status(400)
        .send({ message: "Bunday tokenli foydalanuvchi topilmadi" });
    }
    // console.log(2);
    const payload = {
      id: admin.id,
      email: admin.email,
      role: "admin",
    };
    const tokens = jwtService.generateTokens(payload);
    // console.log(3);
    admin.refresh_token = tokens.refreshToken;
    await admin.save();
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

module.exports = {
  addNewAdmin,
  findAllAdmins,
  findAdminById,
  updateAdminById,
  deleteAdminById,
  loginAdmin,
  logoutAdmin,
  refreshTokenAdmin,
};
