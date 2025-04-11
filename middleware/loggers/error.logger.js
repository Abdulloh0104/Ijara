const expressWinston = require("express-winston");
const winston = require("winston");

module.exports = expressWinston.errorLogger({
  transports: [
    // new winston.transports.Console(),
    new winston.transports.File({ filename: "log/requestErrorLogger.log" }),
  ],
  format: winston.format.combine(winston.format.json()),
});

