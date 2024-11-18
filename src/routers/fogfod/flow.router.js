const express = require("express");
const controller = require("../../controllers/fogfod/flow.controller");
const basicAuth = require("../../middlewares/basicAuth.middleware");

const routes = express.Router();

routes.get("/tfog-h-int", basicAuth, controller.get_tfog_h_int)
routes.get("/tfog-d-int", basicAuth, controller.get_tfog_d_init)
routes.get("/tfod-int", basicAuth, controller.get_tfod_int)

module.exports = routes;