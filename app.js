//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const MongoStore = require("connect-mongo");

mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
require("./config/passport")(passport);

const app = express();
app.set("view engine", "ejs");
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(
  session({
    secret: "hellow",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: "mongodb://localhost:27017/userDB" }),
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static("public"));

app.use(require("./routes/index"))
app.use('/auth', require('./routes/auth'))

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
