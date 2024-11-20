const errorHandler = (error, req, res, next) => {
	
	console.log(error)	

	let code = error?.status || 500
	let message = error?.message
	let detail = null
	let errArr = error?.details
	
	//when error axios
	if (error?.response) {
		code = error?.response?.status
		message = message,
			detail = error?.response?.data
	}

	return res.status(+code || 500).json({
		code: code,
		message: message,
		detail,
		errArr
	})
}

module.exports = errorHandler