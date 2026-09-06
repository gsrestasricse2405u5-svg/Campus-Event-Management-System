const express = require("express");
const router = express.Router();

const db = require("../db");

// REGISTER FOR AN EVENT
router.post("/", (req, res) => {
    const { user_id, event_id } = req.body;

    if (!user_id || !event_id) {
        return res.status(400).json({
            message: "user_id and event_id are required"
        });
    }

    // Check whether the user has already registered
    const checkSql = `
        SELECT * FROM registrations
        WHERE user_id = ? AND event_id = ?
    `;

    db.query(checkSql, [user_id, event_id], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                message: "Database error"
            });
        }

        if (results.length > 0) {
            return res.status(400).json({
                message: "Already registered for this event"
            });
        }

        const insertSql = `
            INSERT INTO registrations (user_id, event_id)
            VALUES (?, ?)
        `;

        db.query(
            insertSql,
            [user_id, event_id],
            (err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({
                        message: "Registration failed"
                    });
                }

                res.status(201).json({
                    message: "Event registration successful",
                    registrationId: result.insertId
                });
            }
        );
    });
});


// GET MY EVENTS
router.get("/user/:user_id", (req, res) => {
    const { user_id } = req.params;

    const sql = `
        SELECT
            registrations.id AS registration_id,
            events.id AS event_id,
            events.title,
            events.description,
            events.date,
            events.time,
            events.venue,
            events.category
        FROM registrations
        JOIN events
            ON registrations.event_id = events.id
        WHERE registrations.user_id = ?
    `;

    db.query(sql, [user_id], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                message: "Failed to fetch registered events"
            });
        }

        res.json(results);
    });
});


module.exports = router;