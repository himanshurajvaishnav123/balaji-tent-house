import { Router } from "express";
import rateLimit from "express-rate-limit";
import {
  createEnquiry,
  getEnquiries,
  updateEnquiryStatus,
  deleteEnquiry,
} from "../controllers/enquiryController";
import { protect } from "../middleware/auth";

const router = Router();

// Prevent spam submissions from the public booking form
const enquiryLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 15,
  message: { message: "Too many enquiries submitted. Please try again later." },
});

router.post("/", enquiryLimiter, createEnquiry); // public
router.get("/", protect, getEnquiries); // admin
router.put("/:id/status", protect, updateEnquiryStatus); // admin
router.delete("/:id", protect, deleteEnquiry); // admin

export default router;
