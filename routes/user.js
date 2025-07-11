const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");
const { isLoggedIn } = require("../middleware");

router.route("/signup")
.get(userController.renderSignupForm)
.post(wrapAsync(userController.signup));

router.route("/login")
.get(userController.renderLoginForm)
.post(
    saveRedirectUrl, 
    passport.authenticate('local', { 
        failureRedirect: '/login', 
        failureFlash: true 
    }), 
    userController.login
);

router.get("/logout", userController.logout );

router.get("/dashboard", isLoggedIn, userController.renderDashboard);

router.get("/delete", isLoggedIn, userController.renderDeleteForm);

router.delete("/delete", isLoggedIn, userController.deleteAccount);

module.exports = router;