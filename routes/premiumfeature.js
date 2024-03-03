const express = require("express");

const route = express.Router();
const authorisationuser = require("../middleware/auth");

const premiumfeatcontroller = require("../controller/premiumfeature");

route.get(
  "/premium/leaderboard",
  authorisationuser.authenticate,
  premiumfeatcontroller.showleaderboard
);

module.exports = route;
