import express from "express";
import { runAccountabilityCheck } from "../controllers/agent.controller.js";
import protect from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/health", (req, res) => {
  res.status(200).json({ status: "Agent service running" });
});

/**
 * GET /api/agents/accountability-check
 * Protected — requires valid JWT.
 * Call this immediately after a successful login on the frontend.
 */
router.get("/accountability-check", protect, runAccountabilityCheck);

export default router;