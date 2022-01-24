const axios = require("axios");
const dotenv = require("dotenv").config();

const FLW_services = require("../services/flutterwave.services");

const User = require("../models/user.model");
const T_Model = require("../models/transaction.model");

const tx_ref = require("../middlewares/tx_ref");

const sendMail = require("../services/mailer.services");

module.exports = {
  getVerifyController: async (req, res, next) => {
    try {

      const id = req.query.transaction_id;
      const tx_ref = req.query.tx_ref;
      const status = req.query.status;

      const verify = await FLW_services.verifyTransaction(id);

      const transaction = await T_Model.findOne({ tx_ref: tx_ref });
      console.log(
        "getVerifyController: ~ transaction",
        transaction
      );

      transaction.status = status;
      await transaction.save();

      const user = req.session.user;

      const mailOptions = {
        to: user.email,
        subject: "Payment confirmation",
        html: `Hello ${user.username}, your transaction was successful, here is your token; <br/> <b>${token}</b>. <br/> Thanks for your patronage.`,
      };

      sendMail(mailOptions);

      return res.status(200).send({
        success: true,
        data: {
          response,
        },
      });
    } catch (err) {
      res.status(500).send({
        success: false,
        message: err.message,
      });
    }
  },

  getVerifyController: async (req, res, next) => {
    try {
      const id = req.query.transaction_id;
      const tx_ref = req.query.tx_ref;
      const status = req.query.status;

      const verify = await FLW_services.verifyTransaction(id);

      const transaction = await T_Model.findOne({ tx_ref: tx_ref });

      transaction.status = "Delivered";
      await transaction.save();

      const mailOptions = {
        to: req.user.email,
        subject: "Payment confirmation",
        html: `Hello ${req.user.username}, your payment was successful. <br/> Thanks for your patronage.`,
      };

      sendMail(mailOptions);

      return res.status(200).send({
        success: true,
        data: {
          verify,
          transaction,
        },
      });
    } catch (err) {
      res.status(500).send({
        success: false,
        message: err.message,
      });
    }
  },
};
