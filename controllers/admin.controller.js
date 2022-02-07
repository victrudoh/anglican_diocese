const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const cloudinary = require("../middlewares/cloudinary.js");
require("dotenv").config();

module.exports = {
  getDashboardController: async (req, res) => {

    const user = await User.find({ role: "user" });
    const users = user.length;

    try {
      res.send({
        data: users,
      });
    } catch (err) {
      res.status(500).send({
        success: false,
        message: err.message,
      });
    }
  },

  getUsersController: async (req, res) => {
    try {
      const users = await User.find();
      res.send(users);
    } catch (err) {
      res.status(500).send({
        success: false,
        message: err.message,
      });
    }
  },

  getViewUserController: async (req, res, next) => {
    try {
      const id = req.query.id;

      const user = await User.findById({ _id: id });

      res.send(user);
    } catch (err) {
      res.status(500).send({
        success: false,
        message: err.message,
      });
    }
  },
};
