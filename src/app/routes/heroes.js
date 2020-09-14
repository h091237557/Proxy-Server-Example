const express = require("express");
const router = express.Router();
const heroModel = require("../../models/hero-model");
const wrap = require("../help");

/**
 * @api {get} /heros - get all heros
 * @apiSuccess {Object[]} heros 
 * @apiSuccess {String} hero.id
 * @apiSuccess {String} hero.name
 * @apiSuccess {String} hero.image
 * @apiSuccess {Object} hero.profile - require authenticated
 * @apiSuccess {String} hero.profile.str
 * @apiSuccess {String} hero.profile.int
 * @apiSuccess {String} hero.profile.agi
 * @apiSuccess {String} hero.profile.luk
 */
router.get("/", wrap(async (req, res) => {
	let heroes;
	if(req.auth){
		heroes = await heroModel.getHeroes();
	}else{
		heroes = await heroModel.getSimpleHeroes();
	}
	res.send({heroes});
}));

/**
 * @api {get} /heros/:heroId - get hero
 * @apiSuccess {String} id
 * @apiSuccess {String} name
 * @apiSuccess {String} image
 * @apiSuccess {Object} profile - require authenticated
 * @apiSuccess {String} profile.str
 * @apiSuccess {String} profile.int
 * @apiSuccess {String} profile.agi
 * @apiSuccess {String} profile.luk
 */
router.get("/:heroId", wrap(async (req, res) => {
	let hero;
	const heroId = req.params.heroId;
	if(req.auth){
		hero = await heroModel.getHero(heroId); 
	}else{
		hero = await heroModel.getSimpleHero(heroId); 
	}
	res.send(hero);
}));

module.exports = router;