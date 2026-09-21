const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();


// ======================================================
// DATABASE
// ======================================================

const connectDB = require("./config/db");


// ======================================================
// ROUTES
// ======================================================

const authRoutes = require("./routes/authRoutes");
const colourRoutes = require("./routes/colourRoutes");
const designRoutes = require("./routes/designRoutes");
const adminRoutes = require("./routes/adminRoutes");

// ======================================================
// CONNECT MONGODB
// ======================================================

connectDB();


// ======================================================
// CREATE EXPRESS APP
// ======================================================

const app = express();


// ======================================================
// MIDDLEWARE
// ======================================================

app.use(cors());

app.use(express.json({ limit: "10mb" }));


// ======================================================
// API ROUTES
// ======================================================

app.use("/api/auth", authRoutes);

app.use("/api/colours", colourRoutes);

app.use("/api/designs", designRoutes);

app.use("/api/admin", adminRoutes);

// ======================================================
// TEST ROUTE
// ======================================================

app.get("/", (req, res) => {

    res.send(
        "🚀 Smart Wall Paint Visualizer Backend is Running!"
    );

});


// ======================================================
// SERVER PORT
// ======================================================

const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {

    console.log(
        `✅ Server running on http://localhost:${PORT}`
    );

});
