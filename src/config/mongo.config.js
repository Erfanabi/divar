const mongoose = require("mongoose");

const DB_URL = process.env.MONGODB_URL;

if (!DB_URL) {
  console.error("❌ Error: MONGODB_URL environment variable is not set!");
  process.exit(1);
}

async function connectDB() {
  try {
    await mongoose.connect(DB_URL);
    console.log("✅ Successfully connected to MongoDB!");
  } catch (err) {
    console.error("❌ Error connecting to MongoDB:", err.message);
    process.exit(1);
  }
}

module.exports = connectDB;


// mongoose.connect(DB_URL)
//   .then(() => console.log("Connected to MongoDB!"))
//   .catch((err) => console.error("Connection failed!", err));
