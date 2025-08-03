const express = require("express");
const session = require("express-session");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const app = express();

const upload = multer({ dest: "uploads/" });

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));

function isAuthenticated(req, res, next) {
  if (req.session.user) return next();
  res.redirect("/login");
}

app.get("/", (req, res) => res.render("index"));
app.get("/login", (req, res) => res.render("login"));
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (username === "admin" && password === "admin123") {
    req.session.user = username;
    res.redirect("/dashboard");
  } else {
    res.send("Invalid credentials.");
  }
});
app.get("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/login"));
});
app.get("/dashboard", isAuthenticated, (req, res) => {
  const files = fs.readdirSync("uploads");
  res.render("dashboard", { files });
});
app.post("/upload", isAuthenticated, upload.single("luaFile"), (req, res) => {
  res.redirect("/dashboard");
});
app.get("/download/:filename", isAuthenticated, (req, res) => {
  const filePath = path.join(__dirname, "../uploads", req.params.filename);
  res.download(filePath);
});

app.listen(process.env.PORT, () => console.log("Server running on port", process.env.PORT));
