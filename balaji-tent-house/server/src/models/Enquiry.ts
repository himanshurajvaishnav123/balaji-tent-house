import { Schema, model, Document } from "mongoose";

export type EventType =
  | "Wedding"
  | "Birthday"
  | "Meeting"
  | "Utensils Rental"
  | "Waterproof Tent"
  | "Other";

export type EnquiryStatus = "Pending" | "Contacted" | "Closed";

export interface IEnquiry extends Document {
  customerName: string;
  phoneNumber: string;
  eventType: EventType;
  eventDate: Date;
  location: string;
  additionalDetails?: string;
  status: EnquiryStatus;
  createdAt: Date;
  updatedAt: Date;
}

const EnquirySchema = new Schema<IEnquiry>(
  {
    customerName: { type: String, required: true, trim: true, maxlength: 100 },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
      match: [/^[0-9+\-\s]{7,15}$/, "Please provide a valid phone number"],
    },
    eventType: {
      type: String,
      enum: [
        "Wedding",
        "Birthday",
        "Meeting",
        "Utensils Rental",
        "Waterproof Tent",
        "Other",
      ],
      required: true,
    },
    eventDate: { type: Date, required: true },
    location: { type: String, required: true, trim: true, maxlength: 200 },
    additionalDetails: { type: String, trim: true, maxlength: 1000 },
    status: {
      type: String,
      enum: ["Pending", "Contacted", "Closed"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

EnquirySchema.index({ createdAt: -1 });
EnquirySchema.index({ status: 1 });

export default model<IEnquiry>("Enquiry", EnquirySchema);
