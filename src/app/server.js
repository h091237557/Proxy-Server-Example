const express = require("express");
const errorHandlerMiddleware = require("./middlewares/error-handler-middleware");
const authCheckModdleware = require("./middlewares/auth-check-middleware");
const routes = require("./routes");
const app = express();

app.use(authCheckModdleware);
app.use(routes);
app.use(errorHandlerMiddleware);

module.exports = app;