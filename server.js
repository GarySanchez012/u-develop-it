//modularized code im importing from connection
const db = require("./db/connection");

//dont need to specify index.js if the directory already has that file in it, node will auto look for it
const apiRoutes = require("./routes/apiRoutes");

const express = require("express");
const inputCheck = require("./utils/inputCheck");

const PORT = process.env.PORT || 3001;
const app = express();

//express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//the /api prefix helps us to remove it from indivdual route expressions after we move them to their new home
//use api routes
app.use("/api", apiRoutes);

//default response for any other request (not found)
//catchall route
app.use((req, res) => {
  res.status(404).end();
});

//start server after db connection
db.connect((err) => {
  if (err) throw err;
  console.log("Database connected.");
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
