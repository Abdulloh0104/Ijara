const { errorHandler } = require("../helpers/error_handler");
const { usersValidation } = require("../validations/users.validation");
const Users = require("../schemas/Users");
const { default: mongoose } = require("mongoose");
const bcrypt = require("bcrypt");
const config = require("config");
const jwtService = require("../services/jwt.client.service");
const uuid = require("uuid");
const mailService = require("../services/mail.service");

const updateUserById = async (req, res) => {
  try {
    const id = req.params.id;

    const { error, value } = usersValidation(req.body);

    if (error) {
      return errorHandler(error, res);
    }

    const {
      username,
      first_name,
      last_name,
      email,
      password,
      confirm_password,
      role,
      is_active,
      phone,
    } = value;
    console.log(value);

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ error: "Incorrect ObjectId" });
    }

    const user = await Users.findOneAndUpdate(
      { _id: id },
      {
        username,
        first_name,
        last_name,
        email,
        password,
        confirm_password,
        role,
        is_active,
        phone,
      },
      { new: true }
    );
    res.send({ user });
  } catch (error) {
    errorHandler(error, res);
  }
};

const addNewUser = async (req, res) => {
  try {
    // const { word } = req.body;

    const { error, value } = usersValidation(req.body);

    if (error) {
      return errorHandler(error, res);
    }
    console.log("545455555555555555555555");
    const {
      username,
      first_name,
      last_name,
      email,
      password,
      confirm_password,
      role,
      is_active,
      phone,
    } = value;
    console.log(value);
    const hashedPassword = bcrypt.hashSync(password, 7);
    const activation_link = uuid.v4();
    //vaqtincha create olib qo'yildi
    const newUser = await Users.create({
      username,
      first_name,
      last_name,
      email,
      password: hashedPassword,
      role,
      is_active,
      phone,
      activation_link,
    });

    await mailService.sendActivationMail(
      newUser.email,
      `
      ${config.get("api_url")}/api/users/activate/${activation_link}
      `
    );
    // const newUser = await Users.create({
    //   ...value,
    //   password: hashedPassword,
    // });
    console.log(newUser);

    res.status(201).send({
      message:
        "Yangi foydalanuvchi qo'shildi. Akkountni faollashtirish uchun pochtaga o'ting",
      newUser,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await Users.find({});
    if (!users) {
      return res
        .status(400)
        .send({ message: "Birorta user foydalanuvchi topilmadi" });
    }

    res.status(200).send({ message: "Foydalanuvchilar", users });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getUserById = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await Users.findById(id);
    if (!user) {
      return res.status(400).send({ message: "Foydalanuvchi topilmadi" });
    }
    res.status(200).send({ message: "Seccess", user });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteUserById = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ error: "Incorrect ObjectId" });
    }

    const user = await Users.findByIdAndDelete({ _id: id });
    res.send({ user });
  } catch (error) {
    errorHandler(error, res);
  }
};

const logoutUser = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res
        .status(400)
        .send({ message: "Cookieda refresh token topilmadi" });
    }
    const user = await Users.findOneAndUpdate(
      { refresh_token: refreshToken },
      { refresh_token: "" },
      { new: true }
    );
    if (!user) {
      return res
        .status(400)
        .send({ message: "Bunday tokenli foydalanuvchi topilmadi" });
    }
    res.clearCookie("refreshToken");
    res.send({ message: "User logged out seccessfully", id: user._id }); //, id:user._id
  } catch (error) {
    errorHandler(error, res);
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    //Identification
    const user = await Users.findOne({ email });
    console.log(user);

    if (!user) {
      return res.status(400).send({ message: "Email yoki password no'tog'ri" });
    }
    //autentifikatsiya
    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(400).send({ message: "Email yoki password no'tog'ri" });
    }
    const payload = {
      id: user._id,
      email: user.email,
      role: user.role,
    };
    const tokens = jwtService.generateTokens(payload);
    user.refresh_token = tokens.refreshToken;
    await user.save();
    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: config.get("refresh_cookie_time"),
    });

    res.send({
      message: "Tizimga xush kelibsiz",
      accessToken: tokens.accessToken,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const refreshTokenUser = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res
        .status(400)
        .send({ message: "Cookieda refresh token topilmadi" });
    }
    const decodedRefreshToken = await jwtService.verifyRefreshToken(
      refreshToken
    );
    const user = await Users.findOne({ refresh_token: refreshToken });
    if (!user) {
      return res
        .status(400)
        .send({ message: "Bunday tokenli foydalanuvchi topilmadi" });
    }
    const payload = {
      id: user._id,
      email: user.email,
      role: user.role,
    };
    const tokens = jwtService.generateTokens(payload);
    user.refresh_token = tokens.refreshToken;
    await user.save();
    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: config.get("refresh_cookie_time"),
    });
    -res.send({
      message: "Tokenlar yangilandi",
      accessToken: tokens.accessToken,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const activateUser = async (req, res) => {
  try {
    const user = await Users.findOne({ activation_link: req.params.link });
    if (!user) {
      return res
        .status(400)
        .send({ message: "Bunday foydalanuvchi topilmadi" });
    }

    user.is_active = true;

    await user.save();
    res.send({
      message: "Foydalanuvchi faollashtirildi",
      status: user.is_active,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  addNewUser,
  getAllUsers,
  getUserById,
  deleteUserById,
  updateUserById,
  loginUser,
  logoutUser,
  refreshTokenUser,
  activateUser,
};
