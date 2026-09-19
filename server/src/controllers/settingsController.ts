import { Request, Response } from 'express';
import { SiteSettings } from '../models/SiteSettings.js';

const defaultSettings = {
  businessName: 'BALAJI TENT HOUSE',
  ownerName: 'Yamuna Shankar Bairagi',
  phone: '+919783950350',
  email: 'himansu@gmail.com',
  address: 'Malka khera, sarkari samiti ke samne, bijoliya, Bhilwara',
  ownerPhotoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop',
  logoUrl: '',
  heroTitle: 'Grand Tent Setup, Royal Weddings & Catering Equipment',
  heroSubtitle: 'Your most trusted event partner in Bijoliya & Bhilwara region. Specialized in Royal Mandap, Waterproof Monsoon Tents & Full Cooking Utensils Rental.',
  heroBannerUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1920&auto=format&fit=crop',
  aboutText: 'Welcome to Balaji Tent House, led by Yamuna Shankar Bairagi. With over 15+ years of dedicated service across Bijoliya and the greater Bhilwara district, we deliver majestic shamianas, waterproof pavilions for monsoon events, luxury lighting, and complete sets of traditional cooking equipment and catering utensils for all your celebratory needs.',
};

export const getSettings = async (_req: Request, res: Response): Promise<void> => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create(defaultSettings);
    }

    res.status(200).json({
      success: true,
      settings,
    });
  } catch (error: any) {
    console.error('getSettings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch site settings.',
      error: error.message,
    });
  }
};

export const updateSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      businessName,
      ownerName,
      phone,
      email,
      address,
      ownerPhotoUrl,
      logoUrl,
      heroTitle,
      heroSubtitle,
      heroBannerUrl,
      aboutText,
    } = req.body;

    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = new SiteSettings(defaultSettings);
    }

    if (businessName !== undefined) settings.businessName = businessName;
    if (ownerName !== undefined) settings.ownerName = ownerName;
    if (phone !== undefined) settings.phone = phone;
    if (email !== undefined) settings.email = email;
    if (address !== undefined) settings.address = address;
    if (ownerPhotoUrl !== undefined) settings.ownerPhotoUrl = ownerPhotoUrl;
    if (logoUrl !== undefined) settings.logoUrl = logoUrl;
    if (heroTitle !== undefined) settings.heroTitle = heroTitle;
    if (heroSubtitle !== undefined) settings.heroSubtitle = heroSubtitle;
    if (heroBannerUrl !== undefined) settings.heroBannerUrl = heroBannerUrl;
    if (aboutText !== undefined) settings.aboutText = aboutText;

    await settings.save();

    res.status(200).json({
      success: true,
      message: 'Site settings updated successfully.',
      settings,
    });
  } catch (error: any) {
    console.error('updateSettings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update site settings.',
      error: error.message,
    });
  }
};
