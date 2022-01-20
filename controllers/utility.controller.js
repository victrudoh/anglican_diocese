const axios = require("axios");
const dotenv = require("dotenv").config();

const FLW_services = require("../services/flutterwave.services");

const User = require("../models/user.model");
const T_Model = require("../models/transaction.model");

const tx_ref = require("../middlewares/tx_ref");

const sendMail = require("../services/mailer.services");

module.exports = {
  postPayController: async (req, res, next) => {
    try {
      const currency = "NGN";
      const amount = parseInt(req.body.amount);
      const newAmount = amount;
      const transREf = await tx_ref.get_Tx_Ref();

      const payload = {
        tx_ref: transREf,
        amount: newAmount,
        currency: currency,
        payment_options: "card",
        redirect_url: "https://topapp-ng.herokuapp.com/utility/verify",
        customer: {
          email: req.body.email,
          phonenumber: req.body.mobile,
          name: req.body.firstName,
        },
        meta: {
          customer_id: req.body.user_id,
        },
        customizations: {
          title: "Anglican Diocese",
          description: "Pay with card",
          logo: "#",
        },
      };

      const transaction = await new T_Model({
        tx_ref: transREf,
        user: req.body.user_id,
        email: req.body.email,
        firstName: req.body.firstName,
        surname: req.body.surname,
        mobile: req.body.mobile,
        currency,
        amount: req.body.amount,
        status: "initiated",
      });

      await transaction.save();

      const response = await FLW_services.initiateTransaction(payload);

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
        to: user.email,
        subject: "Payment confirmation",
        html: `Hello ${user.username}, your payment was successful. <br/> Thanks for your patronage.`,
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