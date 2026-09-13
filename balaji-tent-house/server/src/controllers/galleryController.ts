import { Response } from "express";
import GalleryItem from "../models/GalleryItem";
import { AuthRequest } from "../middleware/auth";

// Public: list all gallery items (newest first)
export const getGalleryItems = async (req: AuthRequest, res: Response) => {
  try {
    const items = await GalleryItem.find().sort({ createdAt: -1 });
    return res.status(200).json(items);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch gallery items" });
  }
};

// Admin: create a new gallery item (appends, never overwrites existing data)
export const createGalleryItem = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, imageUrl, eventLocation, eventType, featured } =
      req.body;

    if (!title || !description || !imageUrl || !eventLocation) {
      return res.status(400).json({
        message: "title, description, imageUrl and eventLocation are required",
      });
    }

    const item = await GalleryItem.create({
      title,
      description,
      imageUrl,
      eventLocation,
      eventType,
      featured: Boolean(featured),
    });

    return res.status(201).json(item);
  } catch (error) {
    return res.status(400).json({ message: "Failed to create gallery item", error: (error as Error).message });
  }
};

// Admin: update an existing gallery item
export const updateGalleryItem = async (req: AuthRequest, res: Response) => {
  try {
    const item = await GalleryItem.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!item) return res.status(404).json({ message: "Gallery item not found" });

    return res.status(200).json(item);
  } catch (error) {
    return res.status(400).json({ message: "Failed to update gallery item" });
  }
};

// Admin: delete a gallery item
export const deleteGalleryItem = async (req: AuthRequest, res: Response) => {
  try {
    const item = await GalleryItem.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "Gallery item not found" });

    return res.status(200).json({ message: "Gallery item deleted", id: req.params.id });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete gallery item" });
  }
};
