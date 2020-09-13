const config =  require("../../config");
const request = require("request");
const EmptyResourceError = require("../errors/empty-resource-error"); 
const UnknownError = require("../errors/unknown-error");

/**
 * @typedef {Object} Model.Hero.Simple
 * @property {Number} id 
 * @property {String} name  
 * @property {String} image  
 */

/**
 * @typedef {Object} Model.Hero.Profile 
 * @property {Number} str 
 * @property {Number} int 
 * @property {Number} agi 
 * @property {Number} luk 
 */

/**
 * @typedef {Object} Model.Hero 
 * @property {Number} id 
 * @property {Number} name 
 * @property {Number} image 
 * @property {Model.Hero.Profile} profile 
 */

module.exports = {
	/**
     * @returns {Promise<Array<Model.Hero.Simple>>}
     */
	getSimpleHeros : function(){
          const url = `${config.source_server.url}/heroes`;
          return new Promise((resolve, reject) => {
               request.get(url, { json: true }, (err, res, body) => {
                    if(err) reject(err);
                    if(res.statusCode === 200) resolve(body);
                    if(res.statusCode !== 200) reject(new UnknownError());
               });
          });
     },
	/**
     * @param {String} id 
     * @returns {Promise<Model.Hero.Simple>}
     */
     getSimpleHero : function(id){
          const url = `${config.source_server.url}/heroes/${id}`;
          return new Promise((resolve, reject) => {
               request.get(url,{
                    json: true
               }, (err, res, body) => {
                    if(err) reject(err);
                    if(res.statusCode === 200) resolve(body);
                    if(res.statusCode === 404) reject(new EmptyResourceError());
                    if(res.statusCode !== 200) reject(new UnknownError());
               });
          });
     },
     /**
      * @param {id} id
      * @returns {Promise<Model.Hero>}
      */
     getHero: async function(id){
          const simpleHero = await this.getSimpleHero(id);
          const hero = await _getDetailHero(simpleHero);
          return hero;
     },
     /**
      * @returns {Promise<Array<Model.Hero>>}
      */
     getHeros: async function(){
          const simpleHeros = await this.getSimpleHeros();
          const heros = await Promise.all(simpleHeros.map((simpleHero, index, heros) => {
               return _getDetailHero(simpleHero); 
          }));
          return heros;
     }
};

/**
* @param {Model.Hero.Simple} hero 
* @returns {Promise<Model.Hero>}
*/
async function _getDetailHero(simpleHero){
     const url = `${config.source_server.url}/heroes/${simpleHero.id}/profile`;
     return new Promise((resolve, reject) => {
          request.get(url,{
               json: true
          }, (err, res, body) => {
               if(err) reject(err);
               if(res.statusCode === 200){
                    resolve({
                         "id": simpleHero["id"],
                         "name": simpleHero["name"],
                         "image": simpleHero["image"],
                         profile: body
                    });
               }
               if(res.statusCode === 404) reject(new EmptyResourceError());
               if(res.statusCode !== 200) reject(new UnknownError());
          });
     });
} 