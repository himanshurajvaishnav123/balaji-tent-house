export interface IUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin';
}

export interface ISiteSettings {
  _id?: string;
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
  updatedAt?: string;
}

export interface IService {
  _id: string;
  title: string;
  description: string;
  iconName: string;
  imageUrl: string;
  priceTag: string;
  isAvailable: boolean;
  createdAt?: string;
}

export type GalleryCategory = 'Tent Decoration' | 'Waterproof Tents' | 'Utensils Rental';

export interface IGalleryItem {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  location: string;
  category: GalleryCategory;
  createdAt?: string;
}

export type EnquiryStatus = 'Pending' | 'Contacted' | 'Resolved';

export interface IEnquiry {
  _id: string;
  customerName: string;
  phone: string;
  eventType: string;
  eventDate: string;
  location: string;
  details: string;
  status: EnquiryStatus;
  createdAt: string;
}
