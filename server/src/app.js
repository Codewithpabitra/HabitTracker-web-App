import express from "express"
import cors from "cors"
import morgan from "morgan"

import authRoutes from "./routes/auth.routes.js"
import habitRoutes from "./routes/habit.routes.js"
import journalRoutes from "./routes/journal.routes.js"
import agentRoutes from "./routes/agent.routes.js";
import settingsRoutes from "./routes/settings.routes.js";


import errorHandler from "./middlewares/error.middleware.js"

const app = express()

// middlewares
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
app.use(express.json())
app.use(morgan("dev"))

// Routes
// test Route 
app.get("/", (req, res) => {
    res.send("Server API is Working");
})

// Actual Routes
app.use("/api/auth", authRoutes)
app.use("/api/habits", habitRoutes)
app.use("/api/journal", journalRoutes)
app.use("/api/agents", agentRoutes);
app.use("/api/settings", settingsRoutes);


// Global error handler
app.use(errorHandler)

export default app;