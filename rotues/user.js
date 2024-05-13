const express = require("express");
const router = express.Router({});
const passport = require("passport");
const { savaUrlredirect } = require("../middelware.js");
const userController = require("../controller/user.js");



// singup
router
  .route("/singup")
  .get(userController.renderSingupFrom)
  .post(userController.singup);


// login
router
  .route("/login")
  .get(userController.renderLoginForm)
  .post(
    savaUrlredirect,
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    userController.login
  );

// logout on User
router.get("/logout", userController.logout);

module.exports = router;
