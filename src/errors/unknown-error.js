class UnknownError extends Error {
	constructor(message){
		if(!message) message = "Unknown Error";
		super(message);
		this.name = this.constructor.name;
		this.httpCode = 500;
	}
}

module.exports = UnknownError;