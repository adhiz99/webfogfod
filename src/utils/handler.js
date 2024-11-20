const validator = require("./validator");
const safe = require("./safe");

const validation = (req, schema = {}) => {
	return new Promise(async (res, rej) => {
		let results = {};
		for await (let [key, value] of Object.entries(schema)) {
			const [error, result] = await safe(() => validator(req[key] || null, value));
			if (error) rej(error);
			results[key] = result;
		};
		res(results);
	});
};

function handler(fn, schema) {
	return async (req, res, next) => {
		try {
			let validate = schema;
			if (typeof schema === "function") {
				validate = schema(req);
			}

			if (validate) {
				await validation(req, validate);
			}

			const response = await fn(req, res, next);

			if(response){
				res.status(response?.status ?? 200).json({
					code: req.method == 'POST' ? 201 : 200,
					message: "Success",
					...response
				});
			}
		} catch (error) {
			if (req.t && !req.t.finished) {
				await req.t.rollback();
			}
			if (req.onError) {
				const result = req.onError(error, req, res, next);
				if (!result) {
					return next(error);
				}
				return
			}
			next(error);
		}
	};
};

module.exports = handler;