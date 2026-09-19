import mongoose, { Document, Schema } from 'mongoose';

export interface ISiteSettings extends Document {
  businessName: string;
  ownerName: string;
  phone: string;
  email: string;
  address: string;
  ownerPhotoUrl: string;
  logoUrl: string;
  heroTitle: string;
  heroSubtitle: string;
  heroBannerUrl: string;
  aboutText: string;
  createdAt: Date;
  updatedAt: Date;
}

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    businessName: {
      type: String,
      required: true,
      default: 'BALAJI TENT HOUSE',
    },
    ownerName: {
      type: String,
      required: true,
      default: 'Yamuna Shankar Bairagi',
    },
    phone: {
      type: String,
      required: true,
      default: '+919783950350',
    },
    email: {
      type: String,
      default: 'himansu@gmail.com',
    },
    address: {
      type: String,
      required: true,
      default: 'Malka khera, sarkari samiti ke samne, bijoliya, Bhilwara',
    },
    ownerPhotoUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop',
    },
    logoUrl: {
      type: String,
      default: '',
    },
    heroTitle: {
      type: String,
      default: 'Grand Tent Setup, Royal Weddings & Catering Equipment',
    },
    heroSubtitle: {
      type: String,
      default: 'Your most trusted event partner in Bijoliya & Bhilwara region. Specialized in Royal Mandap, Waterproof Monsoon Tents & Full Cooking Utensils Rental.',
    },
    heroBannerUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1920&auto=format&fit=crop',
    },
    aboutText: {
      type: String,
      default: 'Welcome to Balaji Tent House, led by Yamuna Shankar Bairagi. With over 15+ years of dedicated service across Bijoliya and the greater Bhilwara district, we deliver majestic shamianas, waterproof pavilions for monsoon events, luxury lighting, and complete sets of traditional cooking equipment and catering utensils for all your celebratory needs.',
    },
  },
  {
    timestamps: true,
  }
);

export const SiteSettings = mongoose.model<ISiteSettings>('SiteSettings', SiteSettingsSchema);
