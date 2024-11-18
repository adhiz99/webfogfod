const safe = async (fn) => {
	try {
		const data = await fn();
		return [null, data];
	} catch (error) {
		return [error, null];
	}
};

module.exports = safe