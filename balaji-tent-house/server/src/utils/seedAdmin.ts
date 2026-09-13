import dotenv from "dotenv";
dotenv.config();

import { connectDB } from "../config/db";
import User from "../models/User";
import SiteSettings from "../models/SiteSettings";
import mongoose from "mongoose";

const seed = async () => {
  await connectDB();

  const email = process.env.ADMIN_EMAIL as string;
  const existing = await User.findOne({ email });

  if (existing) {
    console.log("Admin user already exists:", email);
  } else {
    await User.create({
      name: process.env.ADMIN_NAME,
      email,
      password: process.env.ADMIN_PASSWORD,
      phone: process.env.ADMIN_PHONE,
      role: "admin",
    });
    console.log("Admin user created:", email);
  }

  const settingsExists = await SiteSettings.findOne();
  if (!settingsExists) {
    await SiteSettings.create({
      businessName: "BALAJI TENT HOUSE",
      ownerName: process.env.ADMIN_NAME,
      email,
      phone: process.env.ADMIN_PHONE,
      whatsappNumber: process.env.ADMIN_PHONE,
      address: "Malka Khera, Sarkari Samiti Ke Samne, Bijoliya, Bhilwara",
    });
    console.log("Default site settings created");
  }

  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
