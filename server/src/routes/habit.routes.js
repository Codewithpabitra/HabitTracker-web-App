import express from "express";
import {
  createHabit,
  getHabits,
  updateHabit,
  deleteHabit,
  completeHabit
} from "../controllers/habit.controller.js";
import protect from "../middlewares/auth.middleware.js";

const router = express.Router();


router.get("/health", (req, res) => {
  res.status(200).json({ status: "Habit service running" });
});
router.post("/", protect, createHabit);
router.get("/", protect, getHabits);
router.put("/:id", protect, updateHabit);
router.delete("/:id", protect, deleteHabit);
router.post("/:id/complete", protect, completeHabit);


export default router;