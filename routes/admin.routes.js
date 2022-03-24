const express = require("express");
const path = require("path");

const upload = require("../middlewares/multer");

const adminController = require("../controllers/admin.controller");

const router = express.Router();

router.get("/", adminController.getDashboardController);

// router.get("/dashboard", adminController.getDashboardController);

router.get("/users", adminController.getUsersController);

router.get("/view_user", adminController.getViewUserController);

router.get("/generate_IdCard", adminController.getGenerateIdCardController);

router.get("/generate_QRCode", adminController.getQRCodeController);

router.post("/add_accommodation", adminController.postAddAccommodationController);

module.exports = router;
