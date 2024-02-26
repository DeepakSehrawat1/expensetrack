const express = require("express");
const path = require("path");
const db = require("../util/database.js");
const bcrypt = require("bcrypt");
const user = require("../model/user.js");

const route = express.Router();

route.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "../", "views", "signup.html"));
});

route.post("/user", (req, res) => {
  const { username, email, password } = req.body;
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    /*db.execute(`INSERT INTO user(Name,email,password) VALUES(?,?,?)`, [
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
      });*/

    user
      .create({
        Name: username,
        email: email,
        password: hash,
      })
      .then((responce) => {
        res.json(responce);
        console.log("entered");
      })
      .catch((err) => {
        console.log("in");
        res.status(500).send(err);
        console.log(err);
      });
  });
});

module.exports = route;
