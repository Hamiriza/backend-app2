const config = require("./utils/config");
const express = require("express");
require("express-async-errors");
const app = express();
const cors = require("cors");
const middleware = require("./utils/middleware");
const logger = require("./utils/logger");
const mongoose = require("mongoose");
const usersRouter = require("./controllers/users");
const relationshipsRouter = require("./controllers/relationships");
const loginRouter = require("./controllers/login");

logger.info("connecting to", config.MONGODB_URI);

mongoose
  .connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    logger.info("connected to MongoDB");
  })
  .catch((error) => {
    logger.error("error connecting to MongoDB:", error.message);
  });

app.use(cors());
app.use(express.json());
app.use(middleware.requestLogger);

app.get("/", (request, response) => {
  response.send("<h1>Home Directory</h1>");
});
app.get("/api", (request, response) => {
  response.send(
    "<h1>/api</h1><div><p>avaiable route</p><p>/api/users</p><p>/api/users/:id</p></div>"
  );
});
app.use("/api/login", loginRouter);
app.use("/api/users", usersRouter);
app.use("/api/relationships", relationshipsRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
