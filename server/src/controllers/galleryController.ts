import { Request, Response } from 'express';
import { GalleryItem } from '../models/GalleryItem.js';

export const getGallery = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const items = await GalleryItem.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: items.length,
      items,
    });
  } catch (error: any) {
    console.error('getGallery error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch gallery items.',
      error: error.message,
    });
  }
};

export const createGalleryItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, imageUrl, location, category } = req.body;

    if (!title || !imageUrl || !category) {
      res.status(400).json({
        success: false,
        message: 'Title, Photo, and Category are required.',
      });
      return;
    }

    const newItem = await GalleryItem.create({
      title,
      description: description || '',
      imageUrl,
      location: location || 'Bijoliya, Bhilwara',
      category,
    });

    res.status(201).json({
      success: true,
      message: 'Gallery project added successfully.',
      item: newItem,
    });
  } catch (error: any) {
    console.error('createGalleryItem error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add gallery project.',
      error: error.message,
    });
  }
};

export const updateGalleryItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description, imageUrl, location, category } = req.body;

    const item = await GalleryItem.findById(id);
    if (!item) {
      res.status(404).json({
        success: false,
        message: 'Gallery item not found.',
      });
      return;
    }

    if (title !== undefined) item.title = title;
    if (description !== undefined) item.description = description;
    if (imageUrl !== undefined) item.imageUrl = imageUrl;
    if (location !== undefined) item.location = location;
    if (category !== undefined) item.category = category;

    await item.save();

    res.status(200).json({
      success: true,
      message: 'Gallery item updated successfully.',
      item,
    });
  } catch (error: any) {
    console.error('updateGalleryItem error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update gallery item.',
      error: error.message,
    });
  }
};

export const deleteGalleryItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const item = await GalleryItem.findByIdAndDelete(id);

    if (!item) {
      res.status(404).json({
        success: false,
        message: 'Gallery item not found.',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Gallery project deleted successfully.',
    });
  } catch (error: any) {
    console.error('deleteGalleryItem error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete gallery item.',
      error: error.message,
    });
  }
};
