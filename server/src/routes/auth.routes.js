import express from "express";
import { register, login } from "../controllers/auth.controller.js";
import { getProfile, updateProfile } from "../controllers/profile.controller.js";
import  protect  from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/health", (req, res) => {
  res.status(200).json({ status: "Auth service running" });
});

// Auth
router.post("/register", register);
router.post("/login", login);

// Profile (protected)
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

export default router;