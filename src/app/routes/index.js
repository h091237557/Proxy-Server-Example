const express = require("express");
const router = express.Router();

router.use("/heroes", require("./heroes"));

module.exports = router;