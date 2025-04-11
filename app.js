const express = require("express");
const config = require("config");
const mainRouter = require("./routes/index.routes");
const cookieParser = require("cookie-parser");
const PORT = config.get("port") || 3030;
const sequelize = require("./config/db");
const errorHandling = require("./middleware/errors/error.handling");
const errorLogger = require("./middleware/loggers/error.logger");
const requestLogger = require("./middleware/loggers/request.logger");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(requestLogger);
app.use("/api", mainRouter);
app.use(errorLogger);
app.use(errorHandling); // doim eng oxiriga yozaman

// Catch-all for undefined routes
app.use((req, res, next) => {
  res.status(404).json({ error: "Route not found" });
});


async function start() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true }); //sinxronizatsiya qilish force,alter
    app.listen(PORT, () => {
      console.log(`Server started at: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

start();

// active ligini false qilib qo'yadigan end poin ->Masalan Owner uchun
