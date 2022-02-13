const axios = require("axios");
const dotenv = require("dotenv").config();

const FLW_services = require("../services/flutterwave.services");

const User = require("../models/user.model");
const T_Model = require("../models/transaction.model");
const Attendance = require("../models/attendance.model");

const tx_ref = require("../middlewares/tx_ref");

const sendMail = require("../services/mailer.services");

const moment = require("moment");
const tz = require("moment-timezone");
const getDate = Date.now();

// const setAttendanceCount

module.exports = {
  getVerifyController: async (req, res, next) => {
    try {
      const id = req.query.transaction_id;
      const tx_ref = req.query.tx_ref;
      const status = req.query.status;

      const verify = await FLW_services.verifyTransaction(id);

      const transaction = await T_Model.findOne({ tx_ref: tx_ref });
      console.log("getVerifyController: ~ transaction", transaction);

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

  getDateController: async (req, res) => {
    const getDate = Date.now();
    const currentDate = new Date(getDate);
    const date = currentDate.toDateString();

    // const err = new Date("Fri Jan 20 2012 11:51:36 GMT-0500").toUTCString();

    // const time = moment().format("LLLL");

    // const getDate = Date.now();
    var d = new Date(getDate);
    var myTimezone = "Africa/Lagos";
    var myDatetimeFormat = "DD-MM-YYYY hh:mm:ss a z";
    var myDatetimeString = moment(d).tz(myTimezone).format(myDatetimeFormat);

    res.send({
      date: date,
      // err: err,
      myDatetimeString: myDatetimeString,
      // time: time,
    });
  },

  getWebhookController: async (req, res) => {
    // if (req.event === "charge.completed" && req.data.tx_ref) {
    // console.log('Webhook', req.body.event);
    // return req.body;
    // }

    console.log("Webhooking>>>>>>>>>>");

    var hash = req.headers["verif-hash"];

    if (!hash) {
      console.log("No hash");
      res.redirect("#");
    }

    const secret_hash = process.env.FLUTTERWAVE_WEBHOOK_HASH;

    if (hash !== secret_hash) {
      console.log("Hash does not match");
      res.redirect("#");
    }

    var request_json = JSON.parse(request.body);
    console.log("~ getWebhookController: ~ request_json", request_json);

    // response.send(200);
  },

  postScanAttendanceController: async (req, res) => {
    try {
      const email = req.body.email;
      const eventName = req.body.eventName;

      // DATE STUFF
      var d = new Date(getDate);
      var myTimezone = "Africa/Lagos";
      var myDatetimeFormat = "DD-MM-YYYY hh:mm:ss a z";
      var myDatetimeString = moment(d).tz(myTimezone).format(myDatetimeFormat);

      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).send({
          success: false,
          message: "User not found",
        });
      }

      const alreadyAttended = await Attendance.findOne({ email, eventName });

      if (alreadyAttended) {
        return res.status(404).send({
          success: false,
          message: "User already attended this event",
        });
      }

      user.attendanceCount = user.attendanceCount + 1;

      const newAttendance = await new Attendance({
        user: user._id,
        email,
        eventName,
        date: myDatetimeString,
      });

      await user.save();
      await newAttendance.save();

      return res.status(200).send({
        success: true,
        user: user,
        newAttendance: newAttendance,
        message: "User verified, Attendance updated",
      });
    } catch (err) {
      res.status(500).send({
        success: false,
        message: err.message,
      });
    }
  },

  postGetEventAttendanceListController: async (req, res) => {
    try{
      const eventName = req.body.eventName;

      const Attendees = await Attendance.find({ eventName });

      if (!Attendees) {
        return res.status(404).send({
          success: false,
          message: "Nobody attended this event",
        });
      }

      return res.status(200).send({
        success: true,
        Attendees: Attendees,
      });

    } catch(err) {
      res.status(500).send({
        success: false,
        message: err.message,
      });
    }
  },
};
