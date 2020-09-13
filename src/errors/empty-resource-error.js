class EmptyResourceError extends Error {
	constructor(message){
        if(!message) message = "Empty Resource Error";
		super(message);
		this.name = this.constructor.name;
		this.httpCode = 400;
	}
}

module.exports = EmptyResourceError;