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
        const usersWithSecrets = foundUsers.filter(
          (user) => user.secrets.length > 0
        );
        const allSecrets = usersWithSecrets.flatMap((user) => {
          return user.secrets;
        });
        res.render("secrets", { secrets: allSecrets });
      }
    }
  });
});
module.exports = router;
