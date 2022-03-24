const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

//MODELS
const User = require("../models/user.model");
const T_Model = require("../models/transaction.model");
const Acc = require("../models/accommodation.model");

//MIDDLEWARES
const { uploadImageSingle } = require("../middlewares/cloudinary.js");
const tx_ref = require("../middlewares/tx_ref");


//SERVICES
const FLW_services = require("../services/flutterwave.services");



module.exports = {
    getSignupController: async(req, res) => {
        try {
            res.send("Signup");
        } catch (err) {
            res.status(500).send({
                success: false,
                message: err.message,
            });
        }
    },

    postSignupController: async(req, res, next) => {
        try {
            const { nomenclature, surname, firstName, diocese, province, house, laity, mobile, address, email, role, confirmation_url } = req.body;

            let accommodation = null

            //Upload the image to cloudinary
            const media = await uploadImageSingle(req, res, next);

            // check if email exists
            const emailExists = await User.findOne({ email: email });
            if (emailExists) {
                console.log("Email Exists");
                return res.status(400).send({
                    success: false,
                    message: "Email exists",
                });
            }

            // Bishops
            if (house === 'bishops') {
                // set conditions for each based on  nomenclature

                // ArchBishops
                if (nomenclature === 'most_revd' || nomenclature === 'most_revd_dr') {
                    // send to novel suites
                    const getAcc = await Acc.findOne({
                        alias: 'novel'
                    });

                    // if no rooms
                    if (getAcc.rooms <= 0) {
                        return res.status(400).send({
                            success: false,
                            message: "No free room in hotel",
                        });
                    }

                    getAcc.rooms = getAcc.rooms - 1;
                    await getAcc.save();
                    accommodation = getAcc._id;
                }

                // Bishops
                if (nomenclature === "rt_revd" || nomenclature === 'rt_revd_dr') {
                    // send to crispan hotel
                    const getAcc = await Acc.findOne({
                        alias: "crispan_H",
                    });
                    // if no rooms
                    if (getAcc.rooms <= 0) {
                        return res.status(400).send({
                            success: false,
                            message: "No free room in hotel",
                        });
                    }
                    getAcc.rooms = getAcc.rooms - 1;
                    await getAcc.save();
                    accommodation = getAcc._id;
                }
            }

            // Clergy
            if (house === 'clergy') {
                // send them to Cater center
                const getAcc = await Acc.findOne({
                    alias: "cater",
                });
                // if no rooms
                if (getAcc.rooms <= 0) {
                    return res.status(400).send({
                        success: false,
                        message: "No free room in hotel",
                    });
                }
                getAcc.rooms = getAcc.rooms - 1;
                await getAcc.save();
                accommodation = getAcc._id;
            }

            // Laity
            if (house === 'laity') {
                // set conditions for each based on  nomenclature

                // Mrs
                if (nomenclature === "mrs" || nomenclature === 'dr_mrs') {

                    //  Archbishop wife
                    if (laity === "arch_bish_wife") {
                        // send to novel suites
                        const getAcc = await Acc.findOne({
                            alias: "novel",
                        });
                        // if no rooms
                        if (getAcc.rooms <= 0) {
                            return res.status(400).send({
                                success: false,
                                message: "No free room in hotel",
                            });
                        }
                        getAcc.rooms = getAcc.rooms - 1;
                        await getAcc.save();
                        accommodation = getAcc._id;
                    }

                    //  Bishop wife
                    if (laity === "bish_wife") {
                        // send to crispan hotel
                        const getAcc = await Acc.findOne({
                            alias: "crispan_H",
                        });
                        // if no rooms
                        if (getAcc.rooms <= 0) {
                            return res.status(400).send({
                                success: false,
                                message: "No free room in hotel",
                            });
                        }
                        getAcc.rooms = getAcc.rooms - 1;
                        await getAcc.save();
                        accommodation = getAcc._id;
                    }

                    //  Women rep
                    if (laity === "wom_rep") {
                        // send to crispan apartment
                        const getAcc = await Acc.findOne({
                            alias: "crispan_A",
                        });
                        // if no rooms
                        if (getAcc.rooms <= 0) {
                            return res.status(400).send({
                                success: false,
                                message: "No free room in hotel",
                            });
                        }
                        getAcc.rooms = getAcc.rooms - 1;
                        await getAcc.save();
                        accommodation = getAcc._id;
                    }

                }

                // Legal Officer
                if (laity === "legal") {
                    // do random stuff with value 2, send to any of Valada or Stefans
                    const randNum = Math.floor(Math.random() * 2);
                    console.log("Randnum: ", randNum);

                    if (randNum === 0) {
                        // send to valada
                        const getAcc = await Acc.findOne({
                            alias: "valada",
                        });

                        // if no rooms, use next hotel
                        if (getAcc.rooms <= 0) {
                            getAcc = await Acc.findOne({
                                alias: "stefans",
                            });
                        }

                        getAcc.rooms = getAcc.rooms - 1;
                        await getAcc.save();
                        accommodation = getAcc._id;
                    }

                    if (randNum === 1) {
                        // send to stefans
                        const getAcc = await Acc.findOne({
                            alias: "stefans",
                        });

                        // if no rooms, use next hotel
                        if (getAcc.rooms <= 0) {
                            getAcc = await Acc.findOne({
                                alias: "valada",
                            });
                        }
                        getAcc.rooms = getAcc.rooms - 1;
                        await getAcc.save();
                        accommodation = getAcc._id;
                    }
                }

                // Drivers
                if (laity === "driver") {
                    // send to crudan sabon barki
                    const getAcc = await Acc.findOne({
                        alias: "crudan",
                    });
                    // if no rooms
                    if (getAcc.rooms <= 0) {
                        console.log("no room")
                        return res.status(400).send({
                            success: false,
                            message: "No free room in hotel",
                        });
                    }
                    getAcc.rooms = getAcc.rooms - 1;
                    await getAcc.save();
                    accommodation = getAcc._id;
                }

            }

            // if (!getAcc) {
            //     return res.status(400).send({
            //         success: false,
            //         message: "Could not fetch accommodation, please check nomencleture",
            //     });
            // }

            // const hashedPassword = await bcrypt.hash(password, 12);


            // CREATE USER
            const user = await new User({
                surname,
                firstName,
                nomenclature,
                diocese,
                province,
                house,
                laity,
                mobile,
                address,
                email,
                // password: hashedPassword,
                media,
                role,
                accommodation,
            });

            // const save = await user.save();
            await user.save();

            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

            let payment_url = "";
            try {
                const currency = "NGN";
                const amount = parseInt(2000);
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
                        nomenclature: "Anglican Diocese",
                        description: "Pay with card",
                        logo: "/public/images/logo101.png",
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
                    // amount: req.body.amount,
                    amount: newAmount,
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
                    token,
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

    getAlreadyRegisteredController: async(req, res) => {
        try {
            res.send("Signup");
        } catch (err) {
            res.status(500).send({
                success: false,
                message: err.message,
            });
        }
    },

    postAlreadyRegisteredController: async(req, res) => {
        try {
            const { email, confirmation_url } = req.body

            const user = await User.findOne({ email });
            if (user) {
                let payment_url = "";
                try {
                    const currency = "NGN";
                    const amount = parseInt(2000);
                    const newAmount = amount;
                    const transREf = await tx_ref.get_Tx_Ref();
                    const { mobile, firstName, surname } = user;

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
                            nomenclature: "Anglican Diocese",
                            description: "Pay with card",
                            logo: "/images/logo101.png",
                        },
                    };

                    // SAVE TRANSACTION
                    const transaction = await new T_Model({
                        tx_ref: transREf,
                        user: user._id,
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