import { Schema, model, Document } from "mongoose";

export interface ISiteSettings extends Document {
  businessName: string;
  ownerName: string;
  ownerPhoto: string;
  ownerBio: string;
  logoUrl: string;
  logoShape: "circle" | "square" | "rectangle";
  phone: string;
  whatsappNumber: string;
  email: string;
  address: string;
  updatedAt: Date;
}

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    businessName: { type: String, default: "BALAJI TENT HOUSE" },
    ownerName: { type: String, default: "Yamuna Shankar Bairagi" },
    ownerPhoto: { type: String, default: "" },
    ownerBio: {
      type: String,
      default:
        "Welcome! We've been setting up tents and managing catering essentials for weddings and celebrations across Bhilwara for years. Every event is handled personally, start to finish.",
    },
    logoUrl: { type: String, default: "" },
    logoShape: {
      type: String,
      enum: ["circle", "square", "rectangle"],
      default: "circle",
    },
    phone: { type: String, default: "" },
    whatsappNumber: { type: String, default: "" },
    email: { type: String, default: "" },
    address: {
      type: String,
      default: "Malka Khera, Sarkari Samiti Ke Samne, Bijoliya, Bhilwara",
    },
  },
  { timestamps: true }
);

// Enforce a single settings document via a fixed singleton id pattern,
// handled in the controller (findOneAndUpdate with upsert).
export default model<ISiteSettings>("SiteSettings", SiteSettingsSchema);
