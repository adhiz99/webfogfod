const express = require("express");

const routers = express.Router();

routers.use("/fogfod", require("./fogfod/flow.router"));

module.exports = routers
