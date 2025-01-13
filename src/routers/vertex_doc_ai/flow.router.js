const express = require("express");
const controller = require("../../controllers/vertex_doc_ai/flow.controller");
const basicAuth = require("../../middlewares/basicAuth.middleware");

const routes = express.Router();

routes.get("/get-summary-list", basicAuth, controller.get_summary_list)

module.exports = routes;