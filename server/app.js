const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

mongoose.connect(process.env.MONGO_URI);

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: "risklua_secret",
  resave: false,
  saveUninitialized: true
}));

app.use("/", require("./routes/auth"));
app.use("/scripts", require("./routes/scripts"));

app.listen(3000, () => console.log("Running on http://localhost:3000"));
