const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");
app.use(
  session({
    secret: "This is my secret",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(flash());
app.set("views engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use((req,res,next) => {
  res.locals.successMsg = req.flash('success') 
  res.locals.errorMsg = req.flash("error")
  next()
})

app.get("/", (req, res) => {
  res.send("Working");
});

app.get("/register", (req, res) => {
  let { name } = req.query;
  req.session.name = name;
  if(!req.session.name){
    req.flash('error','You are not registered')
  }else{
    req.flash("success", "You are registered");
  }
  res.redirect("/name");
});

app.get("/name", (req, res) => {
  
  res.render("home.ejs", { name: req.session.name });
});

// app.get("/create", (req, res) => {
//   if (req.session.count) {
//     req.session.count++;
//   } else {
//     req.session.count = 1;
//   }
//   res.send(`pages reload at ${req.session.count} time`);
// });

app.listen(3000, (req, res) => {
  console.log("server is running on port 3000");
});
