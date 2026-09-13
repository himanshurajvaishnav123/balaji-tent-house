import { Router } from "express";
import {
  getSiteSettings,
  updateSiteSettings,
} from "../controllers/settingsController";
import { protect } from "../middleware/auth";

const router = Router();

router.get("/", getSiteSettings); // public
router.put("/", protect, updateSiteSettings); // admin

export default router;
