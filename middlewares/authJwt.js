const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../model/User");

const verifyToken = async (req, res, next) => {
  try {
    //Get token from the headers
    let token = req.headers["x-access-token"];
    console.log("token: ", token);

    if (!token) {
      return res.status(403).send("Unauthorized access");
    }

    //Verify and decode token
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err || !decoded._id) {
        return res.status(401).send("Unauthorized access");
      }

      let user = await User.findOne({ _id: decoded._id });
      if (
        new Date().getTime() < new Date(user.subscription.expiresIn).getTime()
      ) {
        user.subscription.isSubscribed = false;

        await user.save();
      }
      req.user = user;
      next();
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Internal server error");
  }
};

module.exports = verifyToken;
