const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

const usersFile = path.join(__dirname, "users.json");

// Load users
let users = {};
if (fs.existsSync(usersFile)) {
  users = JSON.parse(fs.readFileSync(usersFile));
} else {
  // Default one-time admin login
  users = {
    admin: { password: "admin123", isAdmin: true, used: false }
  };
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

// Handle login
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!users[username]) {
    return res.json({ success: false, message: "User not found." });
  }

  const user = users[username];

  if (user.password === password) {
    // One-time admin login
    if (user.isAdmin && user.used === false) {
      user.used = true;
      fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
      return res.json({ success: true, isAdmin: true, message: "Admin login successful." });
    }

    // Normal user login
    if (!user.isAdmin) {
      return res.json({ success: true, isAdmin: false, message: "Login successful." });
    }

    return res.json({ success: false, message: "Admin account already used." });
  }

  res.json({ success: false, message: "Incorrect password." });
});

// Create new user (only accessible for admins)
app.post("/create-user", (req, res) => {
  const { username, password } = req.body;

  if (users[username]) {
    return res.json({ success: false, message: "User already exists." });
  }

  users[username] = { password, isAdmin: false };
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));

  res.json({ success: true, message: "User created successfully!" });
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
