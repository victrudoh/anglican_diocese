// Dependencies
const jwt = require("jsonwebtoken");

const authenticate = async (req, res, next) => {
  const token = req.header("x-access-token");
  if (!token)
    return res.status(401).send({
      success: false,
      message: "Access denied",
    });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  authenticate,
};
