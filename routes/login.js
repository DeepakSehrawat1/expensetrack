const express = require("express");
const path = require("path");
const db = require("../util/database.js");

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
      if (user.password !== password) {
        res.status(401).send("Invalid  password");
        return;
      }
      res.status(200).json({ message: "Login successful" });
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

module.exports = route;
