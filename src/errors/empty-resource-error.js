class EmptyResourceError extends Error {
	constructor(message){
		if(!message) message = "Empty Resource Error";
		super(message);
		this.name = this.constructor.name;
		this.httpCode = 404;
	}
}

module.exports = EmptyResourceError;