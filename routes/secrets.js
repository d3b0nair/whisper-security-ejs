const router = require("express").Router();
const User = require("../models/User");

router
  .route("/submit")
  .get((req, res) => {
    if (req.isAuthenticated()) {
      res.render("submit");
    } else {
      res.redirect("/auth/login");
    }
  })
  .post((req, res) => {
    const submitedSecret = req.body.secret;
    const autor = req.user.id;
    User.findOneAndUpdate(
      { _id: autor },
      { $push: { secrets: submitedSecret } },
      function (error, success) {
        if (error) {
          console.log(error);
        } else {
          res.redirect('/secrets')
        }
      }
    );
  });
module.exports = router;
