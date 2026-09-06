const express = require('express');
const router = express.Router();
const db = require('../db');

console.log("Auth routes loaded");

// ✅ LOGIN ROUTE (exact path)
router.post('/login', (req, res) => {
  console.log("Login API HIT ✅"); // debug

  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email = ?";

  db.query(sql, [email], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "User not found ❌" });
    }

    const user = results[0];

    if (user.password !== password) {
      return res.status(401).json({ message: "Wrong password ❌" });
    }

    res.json({
      message: "Login successful ✅",
      user: user
    });
  });
});
// REGISTER ROUTE
router.post('/register', (req, res) => {

  const {
    name,
    email,
    password,
    department,
    year,
    phone,
    registered_event
} = req.body;

  const checkSql = "SELECT * FROM users WHERE email = ?";

  db.query(checkSql, [email], (err, results) => {

    if (err) {
      console.error(err);
      return res.status(500).json({
        message: "Database error"
      });
    }

    if (results.length > 0) {
      return res.status(409).json({
        message: "Email already registered"
      });
    }

    const sql = `
      INSERT INTO users
(name, email, password, department, year, phone, registered_event)
VALUES (?, ?, ?, ?, ?, ?, ?)`;

    db.query(
      sql,
      [name, email, password, department, year, phone, registered_event],
      (err, result) => {

        if (err) {
          console.error(err);
          return res.status(500).json({
            message: "Registration failed"
          });
        }

        res.status(201).json({
          message: "Registration successful"
        });

      }
    );

  });

});

module.exports = router;