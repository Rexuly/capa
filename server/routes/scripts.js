const express = require("express");
const multer = require("multer");
const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.get("/", (req, res) => {
  res.send("Scripts Marketplace Coming Soon");
});

router.post("/upload", upload.single("file"), (req, res) => {
  res.send("Script uploaded!");
});

module.exports = router;
