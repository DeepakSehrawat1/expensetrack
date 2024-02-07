const express = require("express");
const path = require("path");
const db = require("../util/database.js");
const bcrypt = require("bcrypt");

const route = express.Router();

route.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "../", "views", "signup.html"));
});

route.post("/user", (req, res) => {
  const { username, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => {
      console.log(password);
      db.execute(`INSERT INTO user(Name,email,password) VALUES(?,?,?)`, [
        username,
        email,
        hash,
      ])
        .then((response) => {
          res.json(response);
        })
        .catch((err) => {
          console.log("in");
          res.status(500).send(err);
        });
    })
    .catch((err) => {
      console.log("out");
      res.status(500).send(err);
    });
});

module.exports = route;
