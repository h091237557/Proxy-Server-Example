const express = require("express");
const router = express.Router();
const authCheckHandle = require("./handles/auth-check-handle");
const heroModel = require("../../models/hero-model");
const wrap = require("../help");

/**
 * @api {get} /heros - get all heros
 * @apiSuccess {Object []} hero
 * @apiSuccess {String} hero.id
 * @apiSuccess {String} hero.name
 * @apiSuccess {String} hero.image
 * @apiSuccess {Object} hero.profile - require authenticated
 * @apiSuccess {String} hero.profile.str
 * @apiSuccess {String} hero.profile.int
 * @apiSuccess {String} hero.profile.agi
 * @apiSuccess {String} hero.profile.luk
 */
router.get("/", authCheckHandle, wrap(async (req, res) => {
    let heroes;
    if(req.auth){
        heroes = await heroModel.getHeros();
    }else{
        heroes = await heroModel.getSimpleHeros();
    }
    res.send(heroes);
}));

/**
 * @api {get} /heros/:heroId - get hero
 * @apiSuccess {Object} hero
 * @apiSuccess {String} hero.id
 * @apiSuccess {String} hero.name
 * @apiSuccess {String} hero.image
 * @apiSuccess {Object} hero.profile - require authenticated
 * @apiSuccess {String} hero.profile.str
 * @apiSuccess {String} hero.profile.int
 * @apiSuccess {String} hero.profile.agi
 * @apiSuccess {String} hero.profile.luk
 */
router.get("/:heroId", authCheckHandle, wrap(async (req, res, next) => {
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