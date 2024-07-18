var express = require("express");
var router = express.Router();

const userController = require("../controllers/userController");
const jwtValidation = require("../utils/jwtValidate");

/* GET users listing. */
router.get("/", jwtValidation, userController.users_get);

router.post("/", userController.users_post);

router.get("/:userId", userController.user_get_single_user);

router.put("/:userId", userController.edit_user);

router.delete("/:userId", userController.delete_user);

module.exports = router;
