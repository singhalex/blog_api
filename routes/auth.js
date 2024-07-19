var express = require("express");
var router = express.Router();
const authController = require("../controllers/authController");
const passportLocalValidate = require("../utils/passportLocal");

router.post("/login", passportLocalValidate, authController.login);

module.exports = router;
