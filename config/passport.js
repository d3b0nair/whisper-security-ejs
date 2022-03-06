const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const mongoose = require("mongoose");

const User = require("../models/User");

module.exports = function (passport) {
  passport.use(User.createStrategy());
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/whisper",
        scope: ["openid", "email", "profile"],
      },
      async (accessToken, refreshToken, profile, done) => {
        const newUser = {
          google_id: profile.id,
          email: profile.emails[0].value,
        };

        try {
          let user = await User.findOne({ google_id: profile.id });

          if (user) {
            done(null, user);
          } else {
            user = await User.create(newUser);
            done(null, user);
          }
        } catch (err) {
          console.error(err);
        }
      }
    )
  );

  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: "http://localhost:3000/auth/facebook/whisper",
        profileFields: ["id", "email"],
      },
      async (accessToken, refreshToken, profile, done) => {
        const newUser = {
          facebook_id: profile.id,
          email: profile.emails[0].value,
        };
        try {
          let user = await User.findOne({ facebook_id: profile.id });
          if (user) {
            done(null, user);
          } else {
            user = await User.create(newUser);
            done(null, user);
          }
        } catch (err) {
          console.error(err);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user));
  });
};
