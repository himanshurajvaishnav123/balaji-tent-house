export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "admin";
}

export interface GalleryItem {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  eventLocation: string;
  eventType: "Wedding" | "Birthday" | "Corporate" | "Social Gathering" | "Other";
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export type EnquiryEventType =
  | "Wedding"
  | "Birthday"
  | "Meeting"
  | "Utensils Rental"
  | "Waterproof Tent"
  | "Other";

export type EnquiryStatus = "Pending" | "Contacted" | "Closed";

export interface Enquiry {
  _id: string;
  customerName: string;
  phoneNumber: string;
  eventType: EnquiryEventType;
  eventDate: string;
  location: string;
  additionalDetails?: string;
  status: EnquiryStatus;
  createdAt: string;
}

export interface EnquiryFormData {
  customerName: string;
  phoneNumber: string;
  eventType: EnquiryEventType;
  eventDate: string;
  location: string;
  additionalDetails?: string;
}

export interface SiteSettings {
  _id?: string;
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
}
