const express = require("express");
const parser = require("body-parser");

const path = require("path");
const signroute = require("./routes/signup.js");
const loginroute = require("./routes/login.js");
const expenseroute = require("./routes/expense.js");
const premiumroute = require("./routes/premium.js");
const premiumfeature = require("./routes/premiumfeature.js");
const sequelize = require("./util/database.js");
const User = require("./model/user.js");
const Expense = require("./model/expense.js");
const Order = require("./model/order.js");

const app = express();

app.use(parser.json());

app.use(express.static(path.join(__dirname, "public")));

app.use(premiumroute);

app.use(premiumfeature);
app.use(loginroute);

app.use(signroute);

app.use(expenseroute);

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

sequelize
  .sync()
  .then(() => {
    console.log("User model synced with database");
    app.listen(5000);
  })
  .catch((err) => {
    console.error("Error syncing User model with database:", err);
  });
