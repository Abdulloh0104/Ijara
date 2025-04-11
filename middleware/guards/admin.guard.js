const { errorHandler } = require("../../helpers/error_handler");
const jwtService = require("../../services/jwt.admin.service");

module.exports = async function (req, res, next) {
  try {
    // Guard yoki Police
    const authorization = req.headers.authorization;
    // console.log(authorization);
    if (!authorization) {
      return res
        .status(403)
        .send({ message: "authorization token berilmagan" });
    }
    const bearer = authorization.split(" ")[0];
    const token = authorization.split(" ")[1];
    // console.log("bearer", bearer);
    // console.log("token", token);

    if (bearer != "Bearer" || !token) {
      return res.status(403).send({ message: "Bearer yoki token berilmagan" });
    }
    // const decodedToken = jwt.verify(token, config.get("tokenKey"));
    const decodedToken = await jwtService.verifyAccessToken(token);
    req.user = decodedToken;

    // if (decodedToken.role != "admin") {
    //   return res
    //     .status(403)
    //     .send({ message: "Ruxsat berilmagan foydalanuvchi" });
    // }
    next();
  } catch (error) {
    errorHandler(error, res);
    return res
        .status(403)
        .send({ message: "Ruxsat berilmagan foydalanuvchi" });
  }
};
