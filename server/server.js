import dotenv from "dotenv";
dotenv.config();

import app from "./src/app.js";
import connectDB from "./src/config/db.js";
import serverless from "serverless-http";

// Safe DB connection — never crashes the serverless function
// connectDB().catch((err) => {
//   console.error("MongoDB connection failed:", err.message);
// });

// Only start the HTTP server in local development.
// On Vercel (serverless), the handler export is used instead.
if (process.env.VERCEL !== "1") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

const handler = serverless(app);
export default handler;