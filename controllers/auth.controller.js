const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const { uploadImageSingle } = require("../middlewares/cloudinary.js");
const FLW_services = require("../services/flutterwave.services");

const T_Model = require("../models/transaction.model");

const tx_ref = require("../middlewares/tx_ref");

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
      const confirmation_url = req.body.confirmation_url;

      //Upload the image to cloudinary
      const media = await uploadImageSingle(req, res, next);

      const emailExists = await User.findOne({ email: email });
      if (emailExists) {
        return res.status(400).send({
          success: false,
          message: "Email exists",
        });
      }

      // const hashedPassword = await bcrypt.hash(password, 12);

      // CREATE USER
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

      // const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

      let payment_url = "";
      try {
        const currency = "NGN";
        const amount = parseInt(500);
        const newAmount = amount;
        const transREf = await tx_ref.get_Tx_Ref();

        // FLUTTERWAVE PAYLOAD
        const payload = {
          tx_ref: transREf,
          amount: newAmount,
          currency: currency,
          payment_options: "card",
          redirect_url: confirmation_url,
          customer: {
            email: email,
            phonenumber: mobile,
            name: firstName,
          },
          meta: {
            customer_id: user._id,
          },
          customizations: {
            title: "Anglican Diocese",
            description: "Pay with card",
            logo: "/images/logo101.png",
          },
        };

        // SAVE TRANSACTION
        const transaction = await new T_Model({
          tx_ref: transREf,
          user: user._id,
          email: req.body.email,
          firstName: req.body.firstName,
          surname: req.body.surname,
          mobile: req.body.mobile,
          currency,
          amount: req.body.amount,
          status: "initiated",
        });

        await transaction.save();

        payment_url = await FLW_services.initiateTransaction(payload);
      } catch (err) {
        console.log("error", err);
      }

      console.log(`payment_url?????`, payment_url);

      return res.status(200).send({
        success: true,

        data: {
          user,
          // token,
          payment_url,
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
        let payment_url = "";
        try {
          const currency = "NGN";
          const amount = parseInt(500);
          const newAmount = amount;
          const transREf = await tx_ref.get_Tx_Ref();
          const email = user.email;
          const mobile = user.mobile;
          const firstName = user.firstName;

          // FLUTTERWAVE PAYLOAD
          const payload = {
            tx_ref: transREf,
            amount: newAmount,
            currency: currency,
            payment_options: "card",
            redirect_url: confirmation_url,
            customer: {
              email: email,
              phonenumber: mobile,
              name: firstName,
            },
            meta: {
              customer_id: user._id,
            },
            customizations: {
              title: "Anglican Diocese",
              description: "Pay with card",
              logo: "/images/logo101.png",
            },
          };

          // SAVE TRANSACTION
          const transaction = await new T_Model({
            tx_ref: transREf,
            user: req.user.id,
            email: email,
            firstName: firstName,
            surname: surname,
            mobile: mobile,
            currency,
            amount: amount,
            status: "initiated",
          });

          await transaction.save();

          payment_url = await FLW_services.initiateTransaction(payload);
        } catch (err) {
          console.log("error", err);
        }

        console.log(`RETURN payment_url?????`, payment_url);

        return res.status(200).send({
          success: true,

          data: {
            user,
            payment_url,
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
