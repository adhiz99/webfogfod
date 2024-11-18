class ErrorResponse extends Error {
	code;
	constructor(parameters, code = 500) {
		super(parameters);
		this.code = code;
	}
}

module.exports = ErrorResponse