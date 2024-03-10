const bcrypt = require("bcrypt");
const User = require("../model/user.js");
const path = require("path");

exports.signuppage = (req, res) => {
  res.sendFile(path.join(__dirname, "../", "views", "signup.html"));
};

exports.signuping = (req, res) => {
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

    User.create({
      Name: username,
      email: email,
      password: hash,
    })
      .then((responce) => {
        res.json(responce);
      })
      .catch((err) => {
        console.log("in");
        res.status(500).send(err);
        console.log(err);
      });
  });
};
