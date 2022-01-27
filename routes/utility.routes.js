const express = require("express");
const path = require("path");

const upload = require("../middlewares/multer");
const verifyToken = require("../middlewares/authJwt");

const utilityController = require("../controllers/utility.controller");

const router = express.Router();

// router.get("/pay", utilityController.postPayController);

// router.post("/pay", [verifyToken], utilityController.postPayController);

// router.get("/date", utilityController.getDateController);

router.get("/webhook", utilityController.getWebhookController);


module.exports = router;
