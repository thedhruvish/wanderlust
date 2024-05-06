const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverrde = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const Review = require("./models/review.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRoutes = require("./rotues/listing.js");
const reviewRoutes = require("./rotues/reviews.js");
const userRoutes = require("./rotues/user.js");

const MONG_URL = "mongodb://127.0.0.1:27017/wanderlust";
main()
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONG_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverrde("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const sessionOption = {
  secret: "This is my secret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 100,
    httpOnly: true,
  },
};
// root route
app.get("/", (req, res) => {
  res.render("./listings/root.ejs");
});

//midal ware
app.use(session(sessionOption));
app.use(flash());

// possword authention
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

//local authention
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//flash to local
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next();
});

// /?demoUser
// app.get("/demoUser", async (req, res) => {
//   const fakerUser = new User({
//     email: "stuendt@gamil.com",
//     username: "dhruavish",
//   });
//   const newUser = await User.register(fakerUser, "123456");
//   res.send(newUser);
// });

// Routes
app.use("/listings", listingRoutes);
app.use("/listings/:id/reviews", reviewRoutes);
app.use("/", userRoutes);

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page is Not Found"));
});

// Error Handling
app.use((err, req, res, next) => {
  let { statusCode = 404, message = "SomeThing Worg" } = err;
  console.log(err);
  res.status(statusCode).render("error.ejs", { message });
});

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
