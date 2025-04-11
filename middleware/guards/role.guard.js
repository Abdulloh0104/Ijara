const ApiError = require("../../helpers/api.error");

module.exports = (allowedRoles) => {
  return (req, res, next) => {
    const user = req.user; // req.user JWT token orqali ketadi

    if (!user) {
      //   return res.status(401).send({ message: "unauthorized" });
      throw ApiError.unauthorized("Token berilmagan");//xatolik ko'tarish
    }
    if (!allowedRoles.includes(user.role)) {
    //   return res.status(403).send({ message: "Access Denied" });
      throw ApiError.forbidden("Access Denied");

    }
    next();
  };
};
