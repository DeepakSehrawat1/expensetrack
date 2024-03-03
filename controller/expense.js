const path = require("path");

const Expense = require("../model/expense.js");
const User = require("../model/user.js");
const sequelize = require("../util/database.js");

const { json } = require("body-parser");

exports.expensepage = (req, res) => {
  res.sendFile(path.join(__dirname, "../", "views", "expense.html"));
};

exports.addelements = async (req, res) => {
  const { id, amount, type, category } = req.body;
  console.log(req.body);
  try {
    const t = await sequelize.transaction();

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

    await Expense.create(
      {
        id: id,
        amount: amount,
        type: type,
        category: category,
        userId: req.user.id,
      },
      { transaction: t }
    );
    let updatedTotalExpense;
    if (req.user.TotalExpense === null) {
      updatedTotalExpense = amount;
    } else {
      updatedTotalExpense = req.user.TotalExpense + amount;
    }

    await User.update(
      { TotalExpense: updatedTotalExpense },
      { where: { id: req.user.id } },
      { transaction: t }
    );
    await t.commit();
    res.status(200).json({ message: "done" });
  } catch (err) {
    t.rollback();
    res.status(500).json({ message: "updating totalexpense gonewrong" });
  }
};

exports.getelements = (req, res) => {
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
};

exports.deletelements = async (req, res) => {
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
  try {
    const expe = await Expense.findByPk(itemId);

    let updatedTotalExpense = req.user.TotalExpense - expe.amount;
    await User.update(
      { TotalExpense: updatedTotalExpense },
      { where: { id: expe.userId } }
    );
    await Expense.destroy({
      where: {
        id: itemId,
      },
    });

    res.status(200).json({ message: "deleted" });
  } catch (err) {
    res.status(500).json({ message: "deleted not" });
  }
};

exports.presentornot = (req, res) => {
  if (req.user.isPremium == 1) {
    return res.json({ message: "true" });
  }

  res.json({ message: "false" });
};
