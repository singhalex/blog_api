const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/users");
const bcrypt = require("bcryptjs");

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      // Search for user
      const user = await User.findOne({ username: username });
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }

      // Compare provided password with encrypted passsword
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        // Passwords do not match
        return done(null, false, { message: "Incorrect password" });
      }

      // Good login, return user
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

const passportLocalValidate = passport.authenticate("local", {
  session: false,
});

module.exports = passportLocalValidate;
