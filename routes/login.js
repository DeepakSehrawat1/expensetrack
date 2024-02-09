const express = require("express");
const path = require("path");
const db = require("../util/database.js");
const bcrypt = require("bcrypt");

const route = express.Router();

route.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "../", "views", "login.html"));
});

route.post("/checklogin", (req, res) => {
  const { email, password } = req.body;

  db.execute("SELECT * FROM user WHERE email = ?", [email])
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
    });
});

module.exports = route;
