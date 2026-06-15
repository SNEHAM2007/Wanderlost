const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("Connected to DB");
    return initDB();
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  try {
    await Listing.deleteMany({});
    initData.data = initData.data.map(obj => {
      return { ...obj, owner: "64a9c0b2f5d1c3001a8b9c8a" }; // Replace with actual user ID
    });
    await Listing.insertMany(initData.data);
    console.log("Data was initialized successfully");
  } catch (err) {
    console.error("Error initializing data:", err);
  } finally {
    mongoose.connection.close(); // close DB connection after seeding
  }
};
