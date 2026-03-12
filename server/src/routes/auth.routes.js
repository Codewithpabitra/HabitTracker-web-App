import express from "express";
import { register, login } from "../controllers/auth.controller.js";


const router = express.Router();

router.get("/health", (req, res) => {
  res.status(200).json({ status: "Auth service running" });
});
router.post("/register", register);
router.post("/login", login);

export default router;