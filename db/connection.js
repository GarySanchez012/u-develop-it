//modularizing code
const mysql = require("mysql2");

//connect to database
const db = mysql.createConnection({
  host: "localhost",
  //your mysql username
  user: "root",
  //your mysql password
  password: "password",
  database: "election",
});

module.exports = db;
