const { json } = require("express");
const jsonWebToken = require("jsonwebtoken");

const issueJWT = (user) => {
  const id = user.id;
  const expiresIn = "1d";
  const payload = {
    sub: id,
    name: user.username,
    iat: Date.now(),
  };

  const signedToken = jsonWebToken.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn,
  });

  return {
    token: "Bearer " + signedToken,
    expiresIn,
  };
};

module.exports = issueJWT;
