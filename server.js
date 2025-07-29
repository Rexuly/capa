const express = require("express");
const session = require("express-session");
const bcrypt = require("bcrypt");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const PORT = 3000;

// Database
const db = new sqlite3.Database("./users.db");

// Create users table if not exists
db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    isAdmin INTEGER DEFAULT 0
)`);

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
    secret: "RANDOM_SECRET_KEY",
    resave: false,
    saveUninitialized: true,
}));

// Serve static frontend
app.use(express.static(path.join(__dirname, "public")));

// First-time setup: create a one-time admin account
const ADMIN_USER = "admin";
const ADMIN_PASS = "TempPass123!";

bcrypt.hash(ADMIN_PASS, 10, (err, hash) => {
    db.get("SELECT * FROM users WHERE username = ?", [ADMIN_USER], (err, row) => {
        if (!row) {
            db.run("INSERT INTO users (username, password, isAdmin) VALUES (?, ?, ?)", [ADMIN_USER, hash, 1]);
            console.log("✅ One-time admin account created:");
            console.log(`Username: ${ADMIN_USER}`);
            console.log(`Password: ${ADMIN_PASS}`);
        }
    });
});

// Login route
app.post("/login", (req, res) => {
    const { username, password } = req.body;
    db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
        if (!user) return res.json({ success: false, message: "Invalid credentials" });

        bcrypt.compare(password, user.password, (err, result) => {
            if (result) {
                req.session.userId = user.id;
                req.session.isAdmin = user.isAdmin;
                return res.json({ success: true, isAdmin: user.isAdmin });
            }
            res.json({ success: false, message: "Invalid credentials" });
        });
    });
});

// Create new account (only accessible to admins)
app.post("/create-account", (req, res) => {
    if (!req.session.isAdmin) return res.json({ success: false, message: "Not authorized" });

    const { username, password } = req.body;
    bcrypt.hash(password, 10, (err, hash) => {
        db.run("INSERT INTO users (username, password, isAdmin) VALUES (?, ?, ?)", [username, hash, 0], function(err) {
            if (err) return res.json({ success: false, message: "Username already exists" });
            res.json({ success: true, message: "Account created successfully" });
        });
    });
});

// Logout
app.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/login.html");
});

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
