require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const cors = require("cors");
const cookieParser = require("cookie-parser");


const app = express();

// ✅ Allowed Origins
const allowedOrigins = [
  "https://e-commerce-view.onrender.com", // Deployed frontend
  "http://localhost:3000",                // Local frontend
];

// ✅ CORS Setup
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS: " + origin));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);


// ✅ Middleware
app.use(express.json());
app.use(cookieParser());


// ✅ MongoDB Connection
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  });

// ✅ Session Setup
app.use(session({
  name: "connect.sid",
  secret: process.env.SESSION_SECRET || "yoursecretkey",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: MONGO_URI }),
  cookie: {
    secure: process.env.NODE_ENV === "production", // true only on HTTPS
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 1000 * 60 * 60 * 24, // 1 day
  },
}));

// ✅ Debug Middleware
app.use((req, res, next) => {
  console.log("🌍 Origin:", req.headers.origin);
  console.log("🧠 Session ID:", req.sessionID);
  console.log("➡️ Request:", req.method, req.originalUrl);
  next();
});

// ✅ Routes
app.use("/users", require("./routes/userRoutes"));
app.use("/products", require("./routes/productRoutes"));
app.use("/categories", require("./routes/categoryRoutes"));
app.use("/orders", require("./routes/orderRoutes"));
app.use("/banners", require("./routes/bannerRoutes"));
app.use("/admin", require("./routes/adminRoutes"));
app.use("/wishlist", require("./routes/wishlistRoutes"));
app.use("/cart", require("./routes/cartRoutes"));
app.use("/", require("./routes/couponRoutes"));

// ✅ Test Route
app.get("/", (req, res) => res.send("✅ API is working"));

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
