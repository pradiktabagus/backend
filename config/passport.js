var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var User = require("../model/user");
// const mongoose = require("mongoose");
// const User = mongoose.model("User");
passport.use(
  new LocalStrategy(
    {
      usernameField: "user[username]",
      passwordField: "user[password]",
    },
    (username, password, done) => {
      User.findOne({ username })
        .then((user) => {
          console.log(user);
          if (!user || !user.validatePassword(password)) {
            return done(null, false, {
              errors: { "email or password": "is invalid" },
            });
          }

          return done(null, user);
        })
        .catch(done);
    }
  )
);

module.exports = passport;
