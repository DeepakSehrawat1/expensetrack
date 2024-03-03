const express = require("express");

const route = express.Router();

const authorisationuser = require("../middleware/auth");

const premiumcontroller = require("../controller/premium");

route.get(
  "/premiumes",
  authorisationuser.authenticate,
  premiumcontroller.registringpremium
);

route.post(
  "/updatetranscationstatus",
  authorisationuser.authenticate,
  premiumcontroller.updatingpremium
);

module.exports = route;
