import dotenv from "dotenv";
dotenv.config();

import app from "./src/app.js";
import connectDB from "./src/config/db.js";
import serverless from "serverless-http";

connectDB().catch((err) => {
  console.error("MongoDB connection failed:", err.message);
});

// Runs only when executed directly (local dev)
// When Vercel imports this file for the handler, this block is skipped
if (process.argv[1].includes("server.js")) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

const handler = serverless(app);
export default handler;