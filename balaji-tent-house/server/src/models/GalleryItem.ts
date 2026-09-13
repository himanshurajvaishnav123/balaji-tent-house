import { Schema, model, Document } from "mongoose";

export interface IGalleryItem extends Document {
  title: string;
  description: string;
  imageUrl: string;
  eventLocation: string;
  eventType:
    | "Wedding"
    | "Birthday"
    | "Corporate"
    | "Social Gathering"
    | "Other";
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const GalleryItemSchema = new Schema<IGalleryItem>(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, required: true, trim: true, maxlength: 800 },
    imageUrl: { type: String, required: true, trim: true },
    eventLocation: { type: String, required: true, trim: true },
    eventType: {
      type: String,
      enum: ["Wedding", "Birthday", "Corporate", "Social Gathering", "Other"],
      default: "Other",
    },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

GalleryItemSchema.index({ createdAt: -1 });

export default model<IGalleryItem>("GalleryItem", GalleryItemSchema);
