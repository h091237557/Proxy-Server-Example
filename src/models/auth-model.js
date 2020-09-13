const config =  require("../../config");
const request = require("request");
const UnauthorizedError = require("../errors/unauthorized-error");
const UnkownError = require("../errors/unknown-error");

module.exports = {
    /**
     * @param {String} name
     * @param {String} password
     * @returns {Promise<Boolean>}
     */
    auth: (name, password) => {
        const url = `${config.source_server.url}/auth`;
        return new Promise((resolve, reject) => {
            request.post(url,{
                json:{ name, password },
            }, (err, res, body) => {
                if(err) reject(err);
                if(res.statusCode === 200) resolve(true);
                if(res.statusCode === 401) reject(new UnauthorizedError("Unauthorized"));
                if(res.statusCode !== 200) reject(new UnkownError("Unkowned Error"));
            });
        });
    }
}