const express = require("express");

const route = express.Router();

const logincontroller = require("../controller/login");

route.get("/login", logincontroller.loginpage);

route.post("/checklogin", logincontroller.checkinglogging);

module.exports = route;
