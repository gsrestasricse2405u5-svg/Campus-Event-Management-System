const express = require("express");
const router = express.Router();

const db = require("../db");

// GET ALL STUDENTS FROM USERS TABLE
router.get("/", (req, res) => {

    const sql = `
        SELECT
            id,
            name,
            email,
            department,
            year,
            phone,
            registered_event
        FROM users
        ORDER BY id DESC
    `;

    db.query(sql, (err, results) => {

        if (err) {
            console.error("Error fetching students:", err);

            return res.status(500).json({
                message: "Failed to fetch students"
            });
        }

        res.json(results);
    });
});

module.exports = router;