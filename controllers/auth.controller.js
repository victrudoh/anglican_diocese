const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const { uploadImageSingle } = require("../middlewares/cloudinary.js");
require("dotenv").config();

module.exports = {
  getSignupController: async (req, res) => {
    try {
      res.send("Signup");
    } catch (err) {
      res.status(500).send({
        success: false,
        message: err.message,
      });
    }
  },

  postSignupController: async (req, res, next) => {
    try {
      const surname = req.body.surname;
      const firstName = req.body.firstName;
      const nomenclature = req.body.nomenclature;
      const diocese = req.body.diocese;
      const province = req.body.province;
      const house = req.body.house;
      const mobile = req.body.mobile;
      const address = req.body.address;
      const email = req.body.email;
      const role = req.body.role;

      //Upload the image to cloudinary
      const media = await uploadImageSingle(req, res, next);
      // const media = await cloudinary.uploader.upload(req.file.path);
      // const password = req.body.password;
      // const media = req.body.media;

      const emailExists = await User.findOne({ email: email });
      if (emailExists) {
        return res.status(400).send({
          success: false,
          message: "Email exists",
        });
      }

      // const hashedPassword = await bcrypt.hash(password, 12);
      const user = await new User({
        surname,
        firstName,
        nomenclature,
        diocese,
        province,
        house,
        mobile,
        address,
        email,
        // password: hashedPassword,
        media,
        role,
      });

      const save = await user.save();

      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

      return res.status(200).send({
        success: true,
        data: {
          user,
          token,
        },
      });
    } catch (err) {
      res.status(500).send({
        success: false,
        message: err.message,
      });
    }
  },

  getAlreadyRegisteredController: async (req, res) => {
    try {
      res.send("Signup");
    } catch (err) {
      res.status(500).send({
        success: false,
        message: err.message,
      });
    }
  },

  postAlreadyRegisteredController: async (req, res) => {
    try {
      const email = req.body.email;

      const user = await User.findOne({ email });
      if (user) {
        return res.status(200).send({
          success: true,
          data: {
            user,
            message: "User found, proceed to payment",
          },
        });
      } else {
        res.status(500).send({
          success: false,
          message: "user not fond, please register",
        });
      }
    } catch (err) {
      console.log(err);
    }
  },

  // getLoginController: async (req, res) => {
  //   try {
  //     res.send("Login");
  //   } catch (err) {
  //     res.status(500).send({
  //       success: false,
  //       message: err.message,
  //     });
  //   }
  // },

  // postLoginController: async (req, res, next) => {
  //   try {
  //     const email = req.body.email;
  //     const password = req.body.password;

  //     const user = await User.findOne({ email: email });
  //     if (!user) {
  //       return res.status(404).send({
  //         success: false,
  //         message: "User not found",
  //       });
  //     }

  //     const passwordMatch = await bcrypt.compare(password, user.password);
  //     if (!passwordMatch) {
  //       return res.status(400).send({
  //         success: false,
  //         message: "invalid login credentilas",
  //       });
  //     }
  //     const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
  //     return res.status(200).send({
  //       success: true,
  //       message: "Login successful",
  //       data: {
  //         user,
  //         token,
  //       },
  //     });
  //   } catch (err) {
  //     res.status(500).send({
  //       success: false,
  //       message: err.message,
  //     });
  //   }
  // },
};
