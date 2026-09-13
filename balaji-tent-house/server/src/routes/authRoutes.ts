import { Router } from "express";
import rateLimit from "express-rate-limit";
import {
  login,
  logout,
  getMe,
  updateProfile,
  changePassword,
} from "../controllers/authController";
import { protect } from "../middleware/auth";

const router = Router();

// Limit brute-force login attempts
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: "Too many login attempts. Please try again later." },
});

router.post("/login", loginLimiter, login);
router.post("/logout", protect, logout);
router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);
router.put("/change-password", protect, changePassword);

export default router;
