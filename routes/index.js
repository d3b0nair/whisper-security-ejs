const router = require("express").Router();
const User = require("../models/User");

router.get("/", (req, res) => {
  res.render("home");
});

router.route("/secrets").get((req, res) => {
  User.find({ secrets: { $ne: null } }, (err, foundUsers) => {
    if (err) {
      console.log(err);
    } else {
      if (foundUsers) {
        const allSecrets = foundUsers.map((user) =>
          user.secrets.map((secret) => secret)
        );
        res.render("secrets", { secrets: allSecrets[0] });
      }
    }
  });
});
module.exports = router;
