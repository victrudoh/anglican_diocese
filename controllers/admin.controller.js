const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const qrcode = require("qrcode");

//MODELS
const User = require("../models/user.model");
const Acc = require("../models/accommodation.model");

//MIDDLEWARES
const cloudinary = require("../middlewares/cloudinary.js");
require("dotenv").config();

module.exports = {
    getDashboardController: async(req, res) => {
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

    getUsersController: async(req, res) => {
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

    getViewUserController: async(req, res, next) => {
        try {
            const id = req.query.id;

            const user = await User.findById({ _id: id }).populate(["accommodation"]);
            console.log(user);

            res.send({
                user: user,
            });
        } catch (err) {
            res.status(500).send({
                success: false,
                message: err.message,
            });
        }
    },

    getGenerateIdCardController: async(req, res, next) => {
        try {
            const id = req.query.id;

            const user = await User.findById({ _id: id });

            const QRData = user.email;
            const QRCode = await qrcode.toDataURL(QRData);

            // const generateQR = async text => {
            //   try {
            //     console.log(await qrcode.toDataURL(text));
            //   } catch(err) {
            //     console.log(err);
            //   }
            // };

            // generateQR(QRData);

            res.send({
                user: user,
                QRCode: QRCode,
            });
        } catch (err) {
            res.status(500).send({
                success: false,
                message: err.message,
            });
        }
    },

    getQRCodeController: async(req, res, next) => {
        try {
            const id = req.query.id;

            const user = await User.findById({ _id: id });

            const QRData = user.email;
            const QRCode = await qrcode.toDataURL(QRData);

            res.send({
                data: QRCode,
            });
        } catch (err) {
            res.status(500).send({
                success: false,
                message: err.message,
            });
        }
    },


    postAddAccommodationController: async(req, res, next) => {
        try {
            const { name, rooms, alias, } = req.body;

            const newAcc = await new Acc({
                name,
                rooms,
                alias,
            });

            await newAcc.save();
            res.send({
                message: 'success',
                data: newAcc,
            })
        } catch (err) {
            res.status(500).send({
                success: false,
                message: err.message,
            });
        }
    },

};