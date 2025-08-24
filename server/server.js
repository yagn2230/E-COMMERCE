require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cors = require('cors');

const app = express();

// ✅ Middleware
app.use(express.json());

// ✅ CORS - Allow frontend to send credentials
app.use(cors({
  origin: "https://e-commerce-view.onrender.com", // your React app's URL
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"]
}));

// ✅ MongoDB Connection
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI not set in .env");
  process.exit(1);
}

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => {
  console.error("❌ MongoDB connection failed:", err);
  process.exit(1);
});

// ✅ Session Setup (store session in MongoDB)
app.use(
  session({
    name: "connect.sid",
    secret: process.env.SESSION_SECRET || "yoursecretkey",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: MONGO_URI }),
    cookie: {
      secure: false,       // Set to true if using HTTPS
      httpOnly: true,
      sameSite: "lax",     // Helps with cross-origin
      maxAge: 1000 * 60 * 60 * 24 // 1 day
    }
  })
);

// ✅ Debug session middleware
app.use((req, res, next) => {
  console.log("🧠 Session:", req.session);
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
app.get("/", (req, res) => {
  res.send("✅ API is working");
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
