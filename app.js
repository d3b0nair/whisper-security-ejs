//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const saltRounds = 10;

mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true });

const userSchema = new mongoose.Schema({ email: String, password: String });
const User = new mongoose.model("User", userSchema);

const app = express();

app.set("view engine", "ejs");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("home");
});

app
  .route("/register")
  .get((req, res) => {
    res.render("register");
  })
  .post((req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    bcrypt.hash(password, saltRounds, function (err, hash) {
      const newUser = new User({
        email: username,
        password: hash,
      });
      newUser.save((err) => {
        err ? console.log(err) : res.render("secrets");
      });
    });
  });

app
  .route("/login")
  .get((req, res) => {
    res.render("login");
  })
  .post((req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({ email: username }, (err, foundUser) => {
      if (err) {
        console.log(err);
      } else {
        if (foundUser) {
          bcrypt.compare(password, foundUser.password, function (err, result) {
            if (result) {
              res.render("secrets");
            }
          });
        }
      }
    });
  });

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
