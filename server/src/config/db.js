import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error("Please define MONGO_URI");
}

// 👇 GLOBAL cache (Vercel best practice)
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) {
    console.log("Using cached DB connection");
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    }).then((mongoose) => mongoose);
  }

  try {
    cached.conn = await cached.promise;
    console.log("MongoDB connected");
  } catch (error) {
    cached.promise = null;
    console.error("DB Error:", error.message);
    throw error;
  }

  return cached.conn;
};

export default connectDB;