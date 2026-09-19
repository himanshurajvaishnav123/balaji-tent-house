import mongoose, { Document, Schema } from 'mongoose';

export interface IService extends Document {
  title: string;
  description: string;
  iconName: string;
  imageUrl: string;
  priceTag: string;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema = new Schema<IService>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    iconName: {
      type: String,
      default: 'Tent',
      trim: true,
    },
    imageUrl: {
      type: String,
      default: '',
      trim: true,
    },
    priceTag: {
      type: String,
      default: 'Custom Packages Available',
      trim: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Service = mongoose.model<IService>('Service', ServiceSchema);
