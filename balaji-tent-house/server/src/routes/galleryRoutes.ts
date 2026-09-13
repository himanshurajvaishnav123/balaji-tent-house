import { Router } from "express";
import {
  getGalleryItems,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
} from "../controllers/galleryController";
import { protect } from "../middleware/auth";

const router = Router();

router.get("/", getGalleryItems); // public
router.post("/", protect, createGalleryItem); // admin
router.put("/:id", protect, updateGalleryItem); // admin
router.delete("/:id", protect, deleteGalleryItem); // admin

export default router;
