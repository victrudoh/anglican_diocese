const express = require("express");
const path = require("path");

const upload = require("../middlewares/multer");

const utilityController = require("../controllers/utility.controller");

const router = express.Router();

// router.get("/login", authController.getLoginController);

// router.post("/login", authController.postLoginController);


module.exports = router;
