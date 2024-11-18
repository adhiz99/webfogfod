const handler = require("../../utils/handler");
const validator = require("../../utils/validator");
const fogfod = require("../../services/fogfod/flow.service");



exports.get_tfog_h_int = handler(async (req) => {
	validator(req.body, (joi) => {
		return joi.object({
			keyword: joi.string(),
		})
	});

	const data = await fogfod.get_tfog_h_int({ ...req.query })

	return data
})

exports.get_tfog_d_init = handler(async (req) => {
	validator(req.body, (joi) => {
		return joi.object({
			keyword: joi.string(),
		})
	});

	const data = await fogfod.get_tfog_d_init({ ...req.query })

	return data
})

exports.get_tfod_int = handler(async (req) => {
	validator(req.body, (joi) => {
		return joi.object({
			keyword: joi.string(),
		})
	});

	const data = await fogfod.get_tfod_int({ ...req.query })

	return data
})
