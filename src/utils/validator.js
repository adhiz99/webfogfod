const Joi = require("joi");

const ErrorResponse = require("./ErrorResponse");

const CustomJoi = Joi.defaults((schema) => {
	const messages = {
		"any.required": "{{#label}} tidak boleh kosong",
		"string.pattern.base": "{{#label}} tidak boleh ada spasi"
	};
	switch (schema.type) {
		case 'string':
			return schema.allow('').messages(messages);
		case 'object':
			return schema.unknown(true).messages(messages);
		default:
			return schema.messages(messages);
	}
});

const validator = async (data, cb) => {
	const { error, ...result } = await cb(CustomJoi).validateAsync(data, {
		abortEarly: false
	});

	if (error) throw new ErrorResponse(error.message, 500);

	return { error, ...result };
};

module.exports = validator;
