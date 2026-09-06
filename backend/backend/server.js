require("dotenv").config();

const express = require("express");
const cors = require("cors");

const db = require("./db");
const authRoutes = require("./routes/auth");
const eventRoutes = require("./routes/events");
const registrationRoutes = require("./routes/registrations");
const userRoutes = require("./routes/users");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/", authRoutes);
app.use("/events", eventRoutes);
app.use("/registrations", registrationRoutes);
app.use("/users", userRoutes);

app.get("/", (req, res) => {
    res.send("Campus Event Management API is running!");
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});