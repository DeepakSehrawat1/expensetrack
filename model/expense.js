const Sequelize = require("sequelize");

const sequelize = require("../util/database.js");

const Expense = sequelize.define("expense", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
  },
  amount: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  type: {
    type: Sequelize.STRING,

    allowNull: false,
    // Assuming emails should be unique
  },
  category: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = Expense;
