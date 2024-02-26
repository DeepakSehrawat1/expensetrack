const express = require("express");
const path = require("path");
const db = require("../util/database.js");
const bcrypt = require("bcrypt");
const user = require("../model/user.js");
const route = express.Router();
const jwt = require("jsonwebtoken");

function generateToken(id) {
  return jwt.sign({ userId: id }, "1234yughj56sjkkhscjOIHCUGB83T29R8Y");
}

route.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "../", "views", "login.html"));
});

route.post("/checklogin", (req, res) => {
  const { email, password } = req.body;

  /* db.execute("SELECT * FROM user WHERE email = ?", [email])
    .then((result) => {
      if (result[0].length === 0) {
        res.status(404).send("Invalid email");
        return;
      }

      const user = result[0][0];
      console.log(password);
      console.log(user.password.toString());
      bcrypt.compare(password, user.password.toString(), (err, kesult2) => {
        if (err) {
          console.log("in");
          res.status(500).send(err);
          return;
        }
        console.log(kesult2);
        if (kesult2 === true) {
          res.status(200).json({ message: "Login successful" });
          return;
        } else {
          res.status(401).send("Invalid  password");
        }
      });
    })
    .catch((err) => {
      console.log("out");
      res.status(500).send(err);
    });*/

  user
    .findAll({ where: { email: email } })
    .then((result) => {
      console.log(result);
      if (result[0].length === 0) {
        res.status(404).send("Invalid email");
        return;
      }

      const users = result[0];
      // console.log(password);
      //  console.log(user.password.toString());
      console.log(users);
      console.log("hello");

      bcrypt.compare(password, users.password, (err, kesult2) => {
        if (err) {
          console.log("in");
          res.status(500).send(err);
          return;
        }
        console.log(kesult2);
        if (kesult2 === true) {
          res
            .status(200)
            .json({
              message: "Login successful",
              token: generateToken(users.id),
            });
          return;
        } else {
          res.status(401).send("Invalid  password");
        }
      });
    })
    .catch((err) => {
      console.log("out");
      res.status(500).send(err);
    });
});

module.exports = route;
