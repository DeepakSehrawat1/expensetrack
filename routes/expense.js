const express = require("express");
const path = require("path");
const db = require("../util/database.js");
const Expense = require("../model/expense.js");
const authorisationuser = require("../middleware/auth");

const route = express.Router();

route.get("/expense", (req, res) => {
  res.sendFile(path.join(__dirname, "../", "views", "expense.html"));
});

route.post("/add-element", authorisationuser.authenticate, (req, res) => {
  const { id, amount, type, category } = req.body;
  console.log(req.body);

  /* db.execute(`INSERT INTO expenses(id,amount,job,category) VALUES(?,?,?,?)`, [
    id,
    expense,
    type,
    category,
  ])
    .then((response) => {
      res.json(response);
    })
    .catch((err) => {
      console.log("in");
      console.log(err);
      res.status(500).send(err);
    });*/

  Expense.create({
    id: id,
    amount: amount,
    type: type,
    category: category,
    userId: req.user.id,
  })
    .then((response) => {
      res.json(response);
      console.log("done");
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
});

route.get("/get-element", authorisationuser.authenticate, (req, res) => {
  /* db.execute(`SELECT* FROM expenses`)
    .then((results) => {
      res.json(results[0]);
    })
    .catch((err) => {
      res.send(err);
    });*/
  Expense.findAll({ where: { userId: req.user.id } })
    .then((results) => {
      res.json(results);
    })
    .catch((err) => {
      res.send(err);
    });
});

route.delete("/delet-element/:id", (req, res) => {
  const itemId = req.params.id;
  console.log(itemId);
  /* db.execute("DELETE FROM expenses WHERE id = ?", [itemId])
    .then((results) => {
      console.log(results);
      res.json(results);
    })
    .catch((err) => {
      console.log(err);
      res.send(err);
    });*/
});

module.exports = route;
