import { Router, Request, Response, NextFunction } from "express";
import { protect } from "../middleware/auth";
import { upload } from "../middleware/upload";
import { uploadImage } from "../controllers/uploadController";

const router = Router();

// Wrap multer so its errors (bad file type, too large) return clean JSON
const handleUpload = (req: Request, res: Response, next: NextFunction) => {
  upload.single("image")(req, res, (err: any) => {
    if (err) {
      return res.status(400).json({ message: err.message || "Upload failed" });
    }
    next();
  });
};

router.post("/image", protect, handleUpload, uploadImage);

export default router;
