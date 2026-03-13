import express from "express";

import {
  createEntry,
  getEntries,
  updateEntry,
  deleteEntry,
  getEmotionalDashboard
} from "../controllers/journal.controller.js";

import protect from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/health", (req, res) => {
  res.status(200).json({ status: "Journal service running" });
});
router.post("/", protect, createEntry);
router.get("/", protect, getEntries);
router.put("/:id", protect, updateEntry);
router.delete("/:id", protect, deleteEntry);
router.get("/dashboard", protect, getEmotionalDashboard);

export default router;