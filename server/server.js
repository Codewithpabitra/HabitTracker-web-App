import dotenv from "dotenv"
dotenv.config();

import app from "./src/app.js"
import connectDB from "./src/config/db.js"
import serverless from "serverless-http";


connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`)
});

const handler = serverless(app);

export default handler;