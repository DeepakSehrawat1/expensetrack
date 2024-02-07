const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost", // Replace with your MySQL server host
  user: "root", // Replace with your MySQL username
  password: "Deeseh@7088%",
  database: "expensetrack",
});

module.exports = pool.promise();
