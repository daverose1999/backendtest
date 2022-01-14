const express = require("express");
/*express router sub package the express framework ships with that gives us different capabilities to conveniently handle different routes reaching diferent endpoints with different http words*/
const router = express.Router();
const UserController = require("../controllers/user");
const checkAuth = require("../middleware/check-auth");
//Create User
router.post("/signup", UserController.user_signup);

//Login User
router.post("/login", UserController.user_login);

//Delete users
router.delete("/:userId", checkAuth, UserController.user_delete_user);

module.exports = router;
