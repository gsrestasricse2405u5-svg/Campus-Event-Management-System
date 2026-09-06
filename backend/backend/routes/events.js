const express = require("express");
const router = express.Router();
const db = require("../db");

// ===============================
// GET ALL
// ===============================
router.get("/", (req, res) => {
    db.query("SELECT * FROM events ORDER BY id DESC", (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Fetch failed" });
        }
        res.json(result);
    });
});

// ===============================
// GET ONE
// ===============================
router.get("/:id", (req, res) => {

    const id = parseInt(req.params.id);

    if (!id) {
        return res.status(400).json({ message: "Invalid ID" });
    }

    db.query("SELECT * FROM events WHERE id=?", [id], (err, result) => {

        if (err) return res.status(500).json({ message: "Error" });

        if (result.length === 0) {
            return res.status(404).json({ message: "Not found" });
        }

        res.json(result[0]);
    });
});

// ===============================
// ADD EVENT (FIXED)
// ===============================
router.post("/", (req, res) => {

    const { title, description, date, time, venue, category } = req.body;

    if (!title || !date || !venue) {
        return res.status(400).json({ message: "Required fields missing" });
    }

    const sql = `
        INSERT INTO events (title, description, date, time, venue, category)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(sql,
        [
            title,
            description || "",
            date,
            time || "00:00:00",
            venue,
            category || "Other"
        ],
        (err, result) => {

            if (err) {
                console.error("INSERT ERROR:", err);
                return res.status(500).json({ message: "Insert failed" });
            }

            res.status(201).json({
                message: "Added",
                id: result.insertId
            });
        }
    );
});

// ===============================
// UPDATE
// ===============================
router.put("/:id", (req, res) => {

    const id = parseInt(req.params.id);

    if (!id) {
        return res.status(400).json({ message: "Invalid ID" });
    }

    const { title, date, venue } = req.body;

    if (!title || !date || !venue) {
        return res.status(400).json({ message: "Missing fields" });
    }

    const sql = `
        UPDATE events SET title=?, date=?, venue=? WHERE id=?
    `;

    db.query(sql, [title, date, venue, id], (err, result) => {

        if (err) return res.status(500).json({ message: "Update failed" });

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Not found" });
        }

        res.json({ message: "Updated" });
    });
});

// ===============================
// DELETE (FULL SAFE)
// ===============================
router.delete("/:id", (req, res) => {

    const id = parseInt(req.params.id);

    if (!id) {
        return res.status(400).json({ message: "Invalid ID - blocked" });
    }

    db.query("DELETE FROM events WHERE id=?", [id], (err, result) => {

        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Delete failed" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Not found" });
        }

        res.json({ message: "Deleted" });
    });
});

module.exports = router;