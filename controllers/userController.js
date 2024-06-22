const expressAsyncHandler = require("express-async-handler");
const User = require("../models/users");
const asyncHandeler = require("express-async-handler");
const bcrypt = require("bcryptjs");

exports.users_get = asyncHandeler(async (req, res, next) => {
  res.send("List of users");
});

exports.users_post = asyncHandeler(async (req, res, next) => {
  bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
    if (err) return next(err);

    const user = new User({
      username: req.body.username,
      password: hashedPassword,
    });

    await user.save();
    res.status(200).json({ message: "User created successfully" });
  });
});

exports.user_get_single_user = asyncHandeler(async (req, res, next) => {
  res.send("Get single user");
});

exports.edit_user = asyncHandeler(async (req, res, next) => {
  res.send("Edit single user");
});

exports.delete_user = asyncHandeler(async (req, res, next) => {
  res.send("Delete user");
});
