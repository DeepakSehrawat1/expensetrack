const express = require("express");

const forgotPasswordController = require("../controller/forgotPassword");

const router = express.Router();

router.get(
  "/updatepassword/:resetpasswordid",
  forgotPasswordController.updatepassword
);

router.get("/resetpassword/:id", forgotPasswordController.resetpassword);

router.post("/forgotpassword", forgotPasswordController.forgotpassword);

module.exports = router;
