const axios = require("axios");
const dotenv = require("dotenv").config();

const FLW_services = require("../services/flutterwave.services");

const User = require("../middlewaresmodels/user.model");
const T_Model = require("../models/transaction.model");

const tx_ref = require("../middlewares/tx_ref");

module.exports = {
  postPayController: async (req, res, next) => {
    try {
      const currency = "NGN";
      const amount = parseInt(req.body.amount);
      const newAmount = amount + 100;
      const transREf = await tx_ref.get_Tx_Ref();

      const payload = {
        tx_ref: transREf,
        amount: newAmount,
        currency: currency,
        payment_options: "card",
        redirect_url: "https://topapp-ng.herokuapp.com/utility/verify",
        customer: {
          email: req.body.email,
          phonenumber: req.body.phone,
          name: req.body.name,
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
        fullname: req.body.name,
        phone,
        currency,
        amount: req.body.amount,
        status: "initiated",
        token: "confirm payment to get token",
      });

      await transaction.save();

      const response = await FLW_services.initiateTransaction(payload);

      return res.status(200).send({
        success: true,
        data: {
          response,
        }
      });

    } catch (err) {
      res.status(500).send({
        success: false,
        message: err.message,
      });
    }
  },
};