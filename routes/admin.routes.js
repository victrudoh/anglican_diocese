const express = require("express");
const path = require("path");

const upload = require("../middlewares/multer");

const adminController = require("../controllers/admin.controller");

const router = express.Router();

router.get("/", adminController.getDashboardController);

// router.get("/dashboard", adminController.getDashboardController);

router.get("/users", adminController.getUsersController);

router.get("/view_user", adminController.getViewUserController);

module.exports = router;
