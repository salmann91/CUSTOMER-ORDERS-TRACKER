const mongoose = require("mongoose");

async function connectDB() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/ordersdb", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Mongoose Connected to MongoDB!");
  } catch (err) {
    console.error("❌ Connection Error:", err);
  }
}

connectDB();
