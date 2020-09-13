class UnauthorizedError extends Error {
	constructor(message){
		if(!message) message = "Unauthorized Error";
		super(message);
		this.name = this.constructor.name;
		this.httpCode = 401;
	}
}

module.exports = UnauthorizedError;