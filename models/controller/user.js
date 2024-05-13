const User = require("../models/user.js");
module.exports.renderSingupFrom = (req, res) => {
  res.render("./user/singup.ejs");
};
module.exports.singup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const newUser = new User({
      username,
      email,
    });
    const registerUser = await User.register(newUser, password);
    console.log(registerUser);
    req.login(registerUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to wanderlust");
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/singup");
  }
};
module.exports.renderLoginForm = (req, res) => {
  res.render("./user/login.ejs");
};

module.exports.login = (req, res) => {
  req.flash("success", "Welcome back to wanderlust");
  const redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "Goodbye!");
    res.redirect("/listings");
  });
};
