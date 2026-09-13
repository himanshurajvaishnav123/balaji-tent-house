import { Response } from "express";
import SiteSettings from "../models/SiteSettings";
import { AuthRequest } from "../middleware/auth";

// Public: fetch current site settings (creates defaults on first call)
export const getSiteSettings = async (_req: AuthRequest, res: Response) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create({});
    }
    return res.status(200).json(settings);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch site settings" });
  }
};

// Admin: update site settings. Uses upsert on the single settings doc so
// updates never create duplicate records or wipe unrelated collections.
export const updateSiteSettings = async (req: AuthRequest, res: Response) => {
  try {
    const allowedFields = [
      "businessName",
      "ownerName",
      "ownerPhoto",
      "ownerBio",
      "logoUrl",
      "logoShape",
      "phone",
      "whatsappNumber",
      "email",
      "address",
    ];

    const updates: Record<string, unknown> = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    }

    const settings = await SiteSettings.findOneAndUpdate(
      {},
      { $set: updates },
      { new: true, upsert: true, runValidators: true }
    );

    return res.status(200).json(settings);
  } catch (error) {
    return res.status(400).json({ message: "Failed to update settings", error: (error as Error).message });
  }
};
