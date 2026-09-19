import mongoose, { Document, Schema } from 'mongoose';

export type GalleryCategory = 'Tent Decoration' | 'Waterproof Tents' | 'Utensils Rental';

export interface IGalleryItem extends Document {
  title: string;
  description: string;
  imageUrl: string;
  location: string;
  category: GalleryCategory;
  createdAt: Date;
  updatedAt: Date;
}

const GalleryItemSchema = new Schema<IGalleryItem>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    imageUrl: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      default: 'Bijoliya, Bhilwara',
      trim: true,
    },
    category: {
      type: String,
      enum: ['Tent Decoration', 'Waterproof Tents', 'Utensils Rental'],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const GalleryItem = mongoose.model<IGalleryItem>('GalleryItem', GalleryItemSchema);
