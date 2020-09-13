/* eslint-disable mocha/no-hooks-for-single-case */
const chai = require("chai");
const supertest = require("supertest");
const config = require("../../config");
const server = require("../../src/app/server");
const sinon = require("sinon");
const r = require("request");

chai.should();

describe("Hero API Spec Test", function() {
	let request;
	let server_;
	let sandbox;
	let emptyHeroId = 999999;
	const mockSimpleHeros = [
		{ "id": 1, "name": "Mark", "image": "http://i.annihil.us/u/prod/marvel/i/mg/6/90/537ba6d4.jpg" },
		{ "id": 2, "name": "Jack", "image": "http://i.annihil.us/u/prod/marvel/i/mg/6/90/537ba6d4.jpg" }
	];
	const mockProfile = { "str": 1, "agi": 2, "int": 4, "luk": 100 };

	before("Generate mock datas",function() {
		server_ = server.listen(config.server.port);
		request = supertest(server_);
		sandbox = sinon.createSandbox();
		const stub = sandbox.stub(r, "get");
		stub.withArgs(`${config.source_server.url}/heroes`)
		.yields(null, {statusCode:200}, mockSimpleHeros);
		mockSimpleHeros.forEach((mockHero) => {
			stub.withArgs(`${config.source_server.url}/heroes/${mockHero["id"]}`)
			.yields(null,{statusCode:200}, mockHero);
			stub.withArgs(`${config.source_server.url}/heroes/${mockHero["id"]}/profile`)
			.yields(null,{statusCode:200}, mockProfile);
		});
		stub.withArgs(`${config.source_server.url}/heroes/${emptyHeroId}`)
		.yields(null, {statusCode:404}, null);
	});

	after(async function() {
		await server_.close();
		sandbox.restore();
	});

	context("Get /heroes and without argument of authentication", function(){
		it("should return correctly result, when get heroes", async function() {
			const res = await request.get("/heroes").set("Accept", "application/json");
			res.status.should.eql(200);
			res.body.heroes.should.have.lengthOf(mockSimpleHeros.length);
			res.body.heroes[0].should.have.property("id", mockSimpleHeros[0]["id"]);
			res.body.heroes[0].should.have.property("name", mockSimpleHeros[0]["name"]);
			res.body.heroes[0].should.have.property("image", mockSimpleHeros[0]["image"]);
		});
	});

	context("Get /heroes and with argument of authentication", function(){
		const standbox_inter = sinon.createSandbox();
		afterEach(() => {
			standbox_inter.restore();
		});

		it("should return correctly result, when send correctly of user infomration", async function() {
			standbox_inter.stub(r, "post").withArgs(`${config.source_server.url}/auth`)
				.yields(null, { statusCode: 200 }, null);

			const res = await request.get("/heroes")
				.set("Accept", "application/json")
				.set("Name", "hahow")
				.set("Password", "rocks");

			res.status.should.eql(200);
			res.body.heroes.should.have.lengthOf(mockSimpleHeros.length);
			res.body.heroes[0].should.have.property("id", mockSimpleHeros[0]["id"]);
			res.body.heroes[0].should.have.property("name", mockSimpleHeros[0]["name"]);
			res.body.heroes[0].should.have.property("image", mockSimpleHeros[0]["image"]);
			res.body.heroes[0].should.have.nested.property("profile.str", mockProfile["str"]);
			res.body.heroes[0].should.have.nested.property("profile.agi", mockProfile["agi"]);
			res.body.heroes[0].should.have.nested.property("profile.int", mockProfile["int"]);
			res.body.heroes[0].should.have.nested.property("profile.luk", mockProfile["luk"]);
		});

		it("should return 401 http code, when send error user of information", async function() {
			standbox_inter.stub(r, "post").withArgs(`${config.source_server.url}/auth`)
				.yields(null, { statusCode: 401 }, null);

			const res = await request.get("/heroes")
				.set("Accept", "application/json")
				.set("Name", "mark")
				.set("Password", "what up guy!");

			res.status.should.eql(401);
		});
	});

	context("Get /hero/:heroId without argument of authentication", function() {
		const standbox_inter = sinon.createSandbox();
		afterEach(() => {
			standbox_inter.restore();
		});

		it("should correctly result, when get hero by id", async function() {
			const res = await request.get("/heroes/1").set("Accept", "application/json");
			res.status.should.eql(200);
			res.body.should.eql(mockSimpleHeros[0]);
		});

		it("should return 404 error code, when get a empty hero by id", async function() {
			const res = await request.get(`/heroes/${emptyHeroId}`).set("Accept", "application/json");
			res.status.should.eql(404);
		});
	});

	context("Get /heroes/:heroId and with argument of authentication", function(){
		const heroId = 1;
		const standbox_inter = sinon.createSandbox();
		afterEach(() => {
			standbox_inter.restore();
		});

		it("should return correctly result, when send correctly user of infomration", async function() {
			standbox_inter.stub(r, "post").withArgs(`${config.source_server.url}/auth`)
				.yields(null, { statusCode: 200 }, null);

			const res = await request.get(`/heroes/${heroId}`)
				.set("Accept", "application/json")
				.set("Name", "hahow")
				.set("Password", "rocks");

			res.status.should.eql(200);
			res.body.should.have.property("id", mockSimpleHeros[0]["id"]);
			res.body.should.have.property("name", mockSimpleHeros[0]["name"]);
			res.body.should.have.property("image", mockSimpleHeros[0]["image"]);
			res.body.should.have.nested.property("profile.str", mockProfile["str"]);
			res.body.should.have.nested.property("profile.agi", mockProfile["agi"]);
			res.body.should.have.nested.property("profile.int", mockProfile["int"]);
			res.body.should.have.nested.property("profile.luk", mockProfile["luk"]);
		});

		it("should return 401 http code, when send error of user information", async function() {
			standbox_inter.stub(r, "post").withArgs(`${config.source_server.url}/auth`)
				.yields(null, { statusCode: 401 }, null);

			const res = await request.get(`/heroes/${heroId}`)
				.set("Accept", "application/json")
				.set("Name", "mark")
				.set("Password", "what up guy!");

			res.status.should.eql(401);
		}).timeout(5000);
	});
});
