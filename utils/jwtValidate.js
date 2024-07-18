require("dotenv").config();
const passport = require("passport");
const ExtractJWT = require("passport-jwt").ExtractJwt;
const JwtStrategy = require("passport-jwt").Strategy;

const User = require("../models/users");

const opts = {};
opts.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET_KEY;

passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      const user = await User.findById(jwt_payload.sub);
      if (!user) {
        return done(null, false, { message: "User not found" });
      } else {
        return done(null, user);
      }
    } catch (err) {
      return done(err);
    }
  })
);

const jwtValidation = passport.authenticate("jwt", { session: false });

module.exports = jwtValidation;
