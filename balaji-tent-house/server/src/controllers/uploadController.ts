import { Response } from "express";
import { AuthRequest } from "../middleware/auth";

// Admin only: handles a single image upload (gallery photo, owner photo, or logo)
// and returns the absolute URL to store in the database.
export const uploadImage = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file was provided" });
    }

    const protocol = req.protocol;
    const host = req.get("host");
    const url = `${protocol}://${host}/uploads/${req.file.filename}`;

    return res.status(201).json({ url });
  } catch (error) {
    return res.status(500).json({ message: "Image upload failed" });
  }
};
