const express = require("express");

const routers = express.Router();

routers.use("/fogfod", require("./fogfod/flow.router"));
routers.use("/vertex-doc-ai", require("./vertex_doc_ai/flow.router"));

module.exports = routers
