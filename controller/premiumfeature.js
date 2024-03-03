const User = require("../model/user.js");
const Expense = require("../model/expense.js");
const sequelize = require("../util/database.js");

exports.showleaderboard = async (req, res) => {
  try {
    const leaderboardusers = await User.findAll({
      attributes: ["Name", "TotalExpense"],
    });
    leaderboardusers.sort((a, b) => b.TotalExpense - a.TotalExpense);

    res.status(200).json(leaderboardusers);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "not" });
  }
};
