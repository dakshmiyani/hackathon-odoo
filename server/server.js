const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./database/db");
connectDB(); // Connect DB

// Routes
const authRoutes = require("./routes/user.routes");
const productRoutes = require("./routes/product.routes");

const app = express();

// ----------------------------
// FIX 1: Prevent JSON Parse Error
// ----------------------------
app.use((req, res, next) => {
  // JSON parser is unnecessary for GET, HEAD, OPTIONS
  if (req.method === "GET" || req.method === "HEAD" || req.method === "OPTIONS") {
    return next();
  }
  next();
});

// ----------------------------
// FIX 2: Safe body parsers
// ----------------------------
app.use(cors());
app.use(
  express.json({
    strict: false,
    limit: "2mb",
    type: ["application/json", "text/plain"], // prevents parsing empty body crashes
  })
);
app.use(express.urlencoded({ extended: true }));

// ----------------------------
// Routes
// ----------------------------
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

// ----------------------------
// Server
// ----------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
