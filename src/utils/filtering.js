/*
	@param {object} config
	{key: [value, column]}:{string : [any, string] }
	@param {string} prefix
*/
const filtering = (config) => {
	// Define valid type options
	const validTypeOptions = ['DEFAULT', 'DATE', 'DATE-BETWEEN', 'ISNULL', 'ISNOTNULL'];

	let where = ""
	Object.entries(config).forEach(([key, { 
		value, column, condition, replace, nullable, 
		operator = "LIKE", 
		prefix = "OR", 
		suffix = "", 
		type = 'DEFAULT',
		specialParam  = {} //dynamic param, you are can set as u need
	}], index) => {
		if (value != 'undefined' && value != undefined) {
			// Check if the provided type is valid
			if (!validTypeOptions.includes(type)) {
				throw new Error(`Invalid type: ${type}. Valid options are: ${validTypeOptions.join(', ')}`);
			}

			let bind = `:${key || '?'}`

			if (operator === "IN") bind = `(:${key || '?'})`

			const isLike = operator === "LIKE"

			if (isLike) {
				column = `LOWER(${column})`;
				if (type === 'DATE') column = `TO_CHAR(${column}, :formatDate)`;

				bind = `'%' || LOWER(:${key || '?'}) || '%'`;
			}

			if(replace) bind = replace
			if(nullable) bind = bind + ` OR ${column} IS NULL \n`

			const insert = condition ? condition(value) : value

			if (type === 'DATE-BETWEEN') {
				const {columnStart, columnEnd} = specialParam;
				column = `TO_DATE(:${key}, :formatDate) BETWEEN ${columnStart} AND ${columnEnd}`;
				operator = "";
				bind = "";
			}

			if (type === 'ISNULL') {
				column = `${column} IS NULL`;
				operator = "";
				bind = "";
			}

			if (type === 'ISNOTNULL') {
				column = `${column} IS NOT NULL`;
				operator = "";
				bind = "";
			}

			if (insert) {
				if (!where) {
					prefix = ""
				}
				where += `${prefix} ${column} ${operator} ${bind} ${suffix}`
			}
		}
	})

	if(where) return `AND ( ${where} )`
	return where
};

module.exports = filtering
