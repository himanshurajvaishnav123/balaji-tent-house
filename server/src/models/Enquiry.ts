import mongoose, { Document, Schema } from 'mongoose';

export type EnquiryStatus = 'Pending' | 'Contacted' | 'Resolved';

export interface IEnquiry extends Document {
  customerName: string;
  phone: string;
  eventType: string;
  eventDate: string;
  location: string;
  details: string;
  status: EnquiryStatus;
  createdAt: Date;
  updatedAt: Date;
}

const EnquirySchema = new Schema<IEnquiry>(
  {
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    eventType: {
      type: String,
      default: 'Wedding / Vivah',
      trim: true,
    },
    eventDate: {
      type: String,
      default: '',
      trim: true,
    },
    location: {
      type: String,
      default: 'Bijoliya / Nearby',
      trim: true,
    },
    details: {
      type: String,
      default: '',
      trim: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Contacted', 'Resolved'],
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  }
);

export const Enquiry = mongoose.model<IEnquiry>('Enquiry', EnquirySchema);
