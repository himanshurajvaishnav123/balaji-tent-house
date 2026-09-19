import { Request, Response } from 'express';
import { Service } from '../models/Service.js';

export const getServices = async (_req: Request, res: Response): Promise<void> => {
  try {
    const services = await Service.find().sort({ createdAt: 1 });
    res.status(200).json({
      success: true,
      count: services.length,
      services,
    });
  } catch (error: any) {
    console.error('getServices error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch services.',
      error: error.message,
    });
  }
};

export const createService = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, iconName, imageUrl, priceTag, isAvailable } = req.body;

    if (!title || !description) {
      res.status(400).json({
        success: false,
        message: 'Title and description are required.',
      });
      return;
    }

    const newService = await Service.create({
      title,
      description,
      iconName: iconName || 'Tent',
      imageUrl: imageUrl || '',
      priceTag: priceTag || 'Best Price in Bijoliya',
      isAvailable: isAvailable !== undefined ? isAvailable : true,
    });

    res.status(201).json({
      success: true,
      message: 'Service offering created successfully.',
      service: newService,
    });
  } catch (error: any) {
    console.error('createService error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create service offering.',
      error: error.message,
    });
  }
};

export const updateService = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description, iconName, imageUrl, priceTag, isAvailable } = req.body;

    const service = await Service.findById(id);
    if (!service) {
      res.status(404).json({
        success: false,
        message: 'Service offering not found.',
      });
      return;
    }

    if (title !== undefined) service.title = title;
    if (description !== undefined) service.description = description;
    if (iconName !== undefined) service.iconName = iconName;
    if (imageUrl !== undefined) service.imageUrl = imageUrl;
    if (priceTag !== undefined) service.priceTag = priceTag;
    if (isAvailable !== undefined) service.isAvailable = isAvailable;

    await service.save();

    res.status(200).json({
      success: true,
      message: 'Service updated successfully.',
      service,
    });
  } catch (error: any) {
    console.error('updateService error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update service.',
      error: error.message,
    });
  }
};

export const deleteService = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const service = await Service.findByIdAndDelete(id);

    if (!service) {
      res.status(404).json({
        success: false,
        message: 'Service not found.',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Service removed successfully.',
    });
  } catch (error: any) {
    console.error('deleteService error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove service.',
      error: error.message,
    });
  }
};
