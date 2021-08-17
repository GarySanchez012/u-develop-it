const express = require("express");
const mysql = require("mysql2");
const inputCheck = require("./utils/inputCheck");

const PORT = process.env.PORT || 3001;
const app = express();

//express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//connect to database
const db = mysql.createConnection(
  {
    host: "localhost",
    //your mysql username
    user: "root",
    //your mysql password
    password: "password",
    database: "election",
  },
  console.log("Connected to the election database.")
);

//query to get all candidates
app.get("/api/candidates", (req, res) => {
  const sql = 
  `SELECT candidates.*, parties.name
  AS party_name
  From candidates
  LEFT JOIN parties
  ON candidates.party_id = parties.id`;

  db.query(sql, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: rows,
    });
  });
});

//query to get a single candidate
app.get("/api/candidate/:id", (req, res) => {
    const sql = 
    `SELECT candidates.*, parties.name 
    AS party_name 
    FROM candidates 
    LEFT JOIN parties 
    ON candidates.party_id = parties.id 
    WHERE candidates.id = ?`;
  const params = [req.params.id];

  db.query(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: row,
    });
  });
  // db.query(`SELECT * FROM candidates WHERE id = 1`, (err, row) => {
  //   if (err) {
  //     console.log(err);
  //   }
  //   console.log(row);
  // });
});

//query to delete a candidate
//the question mark makes it a 'prepared statement'
//prepared statements can execute the same SQL statements repeatedly
//using different values in place of the placeholder
//the 1 param used to demonstrate how prepared statements work
//the 1 makes 'DELETE FROM candidates WHERE id = 1

app.delete("/api/candidate/:id", (req, res) => {
  const sql = `DELETE FROM candidates WHERE id = ?`;
  const params = [req.params.id];

  db.query(sql, params, (err, result) => {
    if (err) {
      res.statusMessage(400).json({ error: res.message });
    } else if (!result.affectedRows) {
      res.json({
        message: "Candidate not found",
      });
    } else {
      res.json({
        message: "deleted",
        changes: result.affectedRows,
        id: req.params.id,
      });
    }
  });
  // db.query(`DELETE FROM candidates WHERE id = ?`, 1, (err, result) => {
  //     if (err) {
  //         console.log(err)
  //     }
  //     console.log(result)
  // })
});

//query to create a candidate
//the SQL command and paramaters wee assigned sql and params
//the 4 placeholders must match the 4 values in params

app.post("/api/candidate", ({ body }, res) => {
  const errors = inputCheck(
    body,
    "first_name",
    "last_name",
    "industry_connected"
  );

  if (errors) {
    res.status(400), json({ error: errors });
  }

  const sql = `INSERT INTO candidates (first_name, last_name, industry_connected) VALUES (?,?,?)`;
  
  const params = [body.first_name, body.last_name, body.industry_connected];

  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: body
    });
  });
  // const sql = `INSERT INTO candidates (id, first_name, last_name, industry_connected) VALUES (?, ?, ?, ?)`;

  // const params = [1, "Ronald", "Firbank", 1];

  // db.query(sql, params, (err, result) => {
  //     if (err) {
  //         console.log(err);
  //     }
  //     console.log(result)
  // })
});

//default response for any other request (not found)
//catchall route
app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
