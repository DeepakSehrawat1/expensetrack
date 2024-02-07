const express = require("express");
const path = require("path");
const db = require("../util/database.js");

const route = express.Router();

route.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../", "views", "signup.html"));
});

route.post("/user", (req, res) => {
  const { username, email, password } = req.body;
  db.execute(`INSERT INTO user(Name,email,password) VALUES(?,?,?)`, [
    username,
    email,
    password,
  ])
    .then((response) => {
      res.json(response);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

module.exports = route;
