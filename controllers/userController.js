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

  const user = await User.findById(id).exec();

  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: "User does not exist" });
  }
});

exports.edit_user = [
  // Validate and sanitize fields
  body("username")
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage("Usernmae must be between 3 and 30 characters"),
  body("password")
    .trim()
    .isLength({ min: 4 })
    .withMessage("Password must be at least 4 characters long"),

  asyncHandeler(async (req, res, next) => {
    const errors = validationResult(req);
    console.log(errors);

    if (!errors.isEmpty()) {
      res.status(401).json(errors);
      return;
    }

    const id = req.params.userId;

    // Check if query is a valid ObjectID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        errors: [
          {
            type: "fields",
            value: req.params.userId,
            msg: "Invalid UserID",
            path: "username",
            location: "body",
          },
        ],
      });
      return;
    }

    if (!(await User.findById(id).exec())) {
      res.status(404).json({
        errors: [
          {
            type: "fields",
            value: req.params.userId,
            msg: "User does not exist",
            path: "username",
            location: "body",
          },
        ],
      });
      return;
    }

    const user = await User.findById(id).exec();

    // Find user with the same username
    const existingUser = await User.findOne({
      username: req.body.username,
    }).exec();

    if (user.id === existingUser?.id || !existingUser) {
      bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
        if (err) return next(err);

        await User.findByIdAndUpdate(id, {
          username: req.body.username,
          password: hashedPassword,
        });
        res.status(201).send("User updated~!!!!");
        return;
      });
    } else {
      res.json({
        errors: [
          {
            type: "fields",
            value: req.body.username,
            msg: "This username already exists",
            path: "username",
            location: "body",
          },
        ],
      });
    }
  }),
];

exports.delete_user = asyncHandeler(async (req, res, next) => {
  const id = req.params.userId;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: "Invalid UserID" });
  }

  if (!(await User.findById(id).exec())) {
    res.status(400).json({ message: "User does not exist" });
  } else {
    await User.findByIdAndDelete(id).exec();
    res.status(200).json({ message: "User deleted" });
  }
});
