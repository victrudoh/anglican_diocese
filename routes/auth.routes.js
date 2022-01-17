const express = require("express");
const path = require("path");

const upload = require("../middlewares/multer");

const authController = require("../controllers/auth.controller");

const router = express.Router();

// router.get("/login", authController.getLoginController);

// router.post("/login", authController.postLoginController);

router.get("/signup", authController.getSignupController);

router.post("/signup", authController.postSignupController);

router.get("/alreadyRegistered", authController.getAlreadyRegisteredController);

router.post("/alreadyRegistered", authController.postAlreadyRegisteredController);

module.exports = router;
