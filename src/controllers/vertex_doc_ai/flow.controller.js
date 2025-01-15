const handler = require("../../utils/handler");
const validator = require("../../utils/validator");
const vertex_doc_ai = require("../../services/vertex_doc_ai/flow.service");



exports.get_summary_list = handler(async (req) => {
	validator(req.body, (joi) => {
		return joi.object({
			keyword: joi.string(),
		})
	});

	const data = await vertex_doc_ai.get_summary_list({ ...req.query })

	return data
})