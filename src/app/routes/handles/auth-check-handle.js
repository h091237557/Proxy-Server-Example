
const authModel = require("../../../models/auth-model");
const wrap = require("../../help");
/**
 * Check the argument of authentication and authenticating.
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 */
module.exports = wrap(async (req, res, next) => {
	const name = req.headers["name"];
	const pwd = req.headers["password"];
	if(name && pwd){
		let result = await authModel.auth(name, pwd);
		if(result === true) req.auth = true;
	}
	next();
});