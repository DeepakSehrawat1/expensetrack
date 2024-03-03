const jwt = require("jsonwebtoken");
const User = require("../model/user");

const authenticate = (req, res, next) => {
  try {
    const token = req.header("Authorization");

    const user = jwt.verify(token, "1234yughj56sjkkhscjOIHCUGB83T29R8Y");
    User.findByPk(user.userId)
      .then((user) => {
        req.user = user;
        next();
      })
      .catch((err) => {
        throw new Error(err);
      });
  } catch (err) {
    return res.status(401).json({ success: fail });
  }
};

module.exports = {
  authenticate,
};
