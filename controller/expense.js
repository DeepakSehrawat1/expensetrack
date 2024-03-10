const path = require("path");

const Expense = require("../model/expense.js");
const User = require("../model/user.js");
const sequelize = require("../util/database.js");
require("dotenv").config();

const { json } = require("body-parser");
const AWS = require("aws-sdk");

const noOfpageItem = 1;

exports.expensepage = (req, res) => {
  res.sendFile(path.join(__dirname, "../", "views", "expense.html"));
};

exports.addelements = async (req, res) => {
  const { id, amount, type, category } = req.body;
  console.log(req.body);
  try {
    const t = await sequelize.transaction();

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
  const page = req.query.page || 1;
  Expense.count({ where: { userId: req.user.id } })
    .then((total) => {
      let totalexpenses = total;
      return Expense.findAll({
        where: {
          userId: req.user.id,
        },

        offset: (page - 1) * noOfpageItem,
        limit: noOfpageItem,
      })
        .then((results) => {
          res.json({
            results: results,
            currentPage: page,
            hasNext: noOfpageItem * page < totalexpenses,
            nextPge: 1 * page + 1,
            hasPrev: page > 1,
            previousPage: 1 * page - 1,
            lastPage: Math.ceil(totalexpenses / noOfpageItem),
          });
        })
        .catch((err) => {
          console.log(err);
          res.send(err);
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
};

exports.deletelements = async (req, res) => {
  const itemId = req.params.id;
  console.log(itemId);

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

function uploadToS3(data, filename) {
  const BUCKET_NAME = process.env.BUCKET_NAME;
  const IAM_USER_KEY = process.env.IAM_USER_KEY;
  const IAM_USER_SECRET = process.env.IAM_USER_SECRET;
  console.log(BUCKET_NAME);

  let s3bucket = new AWS.S3({
    accessKeyId: IAM_USER_KEY,
    secretAccessKey: IAM_USER_SECRET,
    //Bucket: BUCKET_NAME
  });

  var params = {
    Bucket: BUCKET_NAME,
    Key: filename,
    Body: data,
    ACL: "public-read",
  };
  return new Promise((resolve, reject) => {
    s3bucket.upload(params, (err, s3response) => {
      if (err) {
        console.log("Something went Wrong");

        reject(err);
      } else {
        console.log("Success", s3response);
        resolve(s3response.Location);
      }
    });
  });
}

exports.downloadexpense = async (req, res) => {
  try {
    const expenses = await Expense.findAll({ where: { userId: req.user.id } });

    if (!expenses || expenses.length === 0) {
      return res
        .status(404)
        .json({ error: "No expenses found for the user", success: false });
    }

    const stringifiedExpenses = JSON.stringify(expenses);
    const userId = req.user.id;
    const filename = `Expenses${userId}/${new Date().toISOString()}.txt`;

    const fileURL = await uploadToS3(stringifiedExpenses, filename);

    res.status(200).json({ fileURL, success: true });
  } catch (error) {
    console.error(error);

    res
      .status(500)
      .json({ fileURL: "", success: false, err: "Internal Servaer Error" });
  }
};
