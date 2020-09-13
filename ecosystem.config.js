module.exports = {
	apps : [{
		script: "index.js",
		watch: ".",
		instances: 2,
		exec_mode: "cluster"
	}],
};
