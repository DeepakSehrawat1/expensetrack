const express = require("express");

const route = express.Router();
const authorisationuser = require("../middleware/auth");

const expensecontroller = require("../controller/expense");

route.get("/expense", expensecontroller.expensepage);

route.post(
  "/add-element",
  authorisationuser.authenticate,
  expensecontroller.addelements
);

route.get(
  "/get-element",
  authorisationuser.authenticate,
  expensecontroller.getelements
);

route.get(
  "/check_boolean",
  authorisationuser.authenticate,
  expensecontroller.presentornot
);

route.delete(
  "/delet-element/:id",
  authorisationuser.authenticate,
  expensecontroller.deletelements
);

route.get(
  "/expense/download",
  authorisationuser.authenticate,
  expensecontroller.downloadexpense
);

module.exports = route;
