const User = require("../models/users");
const issueJWT = require("../utils/jwtIssue");

exports.login = (req, res, next) => {
  const jwt = issueJWT(req.user);
  console.log(jwt);
  res.status(201).json({
    message: "User logged in successfully",
    token: jwt.token,
    expiresIn: jwt.expiresIn,
  });
};
