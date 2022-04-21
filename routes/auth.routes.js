const express = require("express");
const path = require("path");

const { multerUploads } = require("../middlewares/multer");

const authController = require("../controllers/auth.controller");
const verifyToken = require("../middlewares/authJwt");

const router = express.Router();

// router.get("/login", authController.getLoginController);

// router.post("/login", authController.postLoginController);

router.get("/signup", authController.getSignupController);

router.post("/signup", multerUploads.single('media'), authController.postSignupController);

router.get("/alreadyRegistered", authController.getAlreadyRegisteredController);

router.post("/alreadyRegistered", authController.postAlreadyRegisteredController);

router.get("/verify", authController.getVerifyPayment);

router.get("/profile", [verifyToken], authController.getProfileController);

module.exports = router;