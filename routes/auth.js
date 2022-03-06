const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/User");

router.get(
  "/google",
  passport.authenticate("google", { scope: ["openid", "email", "profile"] })
);
router.get(
  "/google/whisper",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function (req, res) {
    res.redirect("/secrets");
  }
);

router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);
router.get(
  "/facebook/whisper",
  passport.authenticate("facebook", { failureRedirect: "/login" }),
  function (req, res) {
    res.redirect("/secrets");
  }
);

router
  .route("/register")
  .get((req, res) => {
    res.render("register");
  })
  .post((req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    User.register({ username }, password, (err, user) => {
      if (err) {
        console.log(err);
        res.redirect("/auth/register");
      } else {
        passport.authenticate("local")(req, res, () => {
          res.redirect("/secrets");
        });
      }
    });
  });

router
  .route("/login")
  .get((req, res) => {
    res.render("login");
  })
  .post((req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const user = new User({
      username,
      password,
    });
    req.login(user, (err) => {
      err
        ? console.log(err)
        : passport.authenticate("local")(req, res, () => {
            res.redirect("/secrets");
          });
    });
  });

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

router.get((req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
