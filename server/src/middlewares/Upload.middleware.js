import multer from "multer";

/**
 * Multer config for proof image uploads.
 *
 * - memoryStorage: file stays in RAM as a Buffer (req.file.buffer).
 *   We never write to disk — the base64 goes straight to Gemini.
 * - 5MB limit: generous enough for phone photos, prevents abuse.
 * - Only JPEG, PNG, WEBP allowed.
 */
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/webp"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, PNG, and WEBP images are allowed."), false);
  }
};

export const uploadProof = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter,
}).single("proof"); // frontend must use field name "proof"