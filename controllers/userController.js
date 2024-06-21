const expressAsyncHandler = require("express-async-handler");
const User = require("../models/users");
const asyncHandeler = require("express-async-handler");

exports.users_get = asyncHandeler(async (req, res, next) => {
  res.send("List of users");
});

exports.users_post = asyncHandeler(async (req, res, next) => {
  res.send("Add new user");
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
