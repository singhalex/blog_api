const expressAsyncHandler = require("express-async-handler");
const User = require("../models/users");
const asyncHandeler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const { default: mongoose, mongo } = require("mongoose");

exports.users_get = asyncHandeler(async (req, res, next) => {
  // TODO - Add logic to access user info only if authorized
  const allUsers = await User.find().exec();
  res.json(allUsers);
});

exports.users_post = [
  // Validate and sanitize fields
  body("username")
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage("Username must be between 3 and 30 characters."),
  body("password")
    .trim()
    .isLength({ min: 4 })
    .withMessage("Password must be at least 4 characters long."),

  asyncHandeler(async (req, res, next) => {
    // Extract errors from request
    const errors = validationResult(req);

    bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
      if (err) return next(err);

      const user = new User({
        username: req.body.username,
        password: hashedPassword,
      });

      const userExists = await User.findOne({ username: user.username }).exec();

      if (userExists) {
        errors.errors.unshift({
          type: "field",
          value: user.username,
          msg: "This username already exists",
          path: "username",
          location: "body",
        });
      }

      if (!errors.isEmpty()) {
        // There are errors. Send error object
        res.status(401).json(errors);
      } else {
        await user.save();
        res.status(201).json({ message: "User created successfully" });
      }
    });
  }),
];

exports.user_get_single_user = asyncHandeler(async (req, res, next) => {
  const id = req.params.userId;

  // Check if request is a valid userID object
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: "Invalid UserID" });
  }

  const user = await User.findById(id);

  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: "User does not exist" });
  }
});

exports.edit_user = asyncHandeler(async (req, res, next) => {
  res.send("Edit single user");
});

exports.delete_user = asyncHandeler(async (req, res, next) => {
  res.send("Delete user");
});
