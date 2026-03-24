import express from "express";
import {
  getSettings,
  updateSettings,
  exportData,
  deleteAccount,
} from "../controllers/settings.controller.js";
import protect from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/",          protect, getSettings);
router.put("/",          protect, updateSettings);
router.get("/export",    protect, exportData);
router.delete("/account",protect, deleteAccount);

export default router;