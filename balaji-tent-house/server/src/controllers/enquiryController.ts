import { Response } from "express";
import Enquiry from "../models/Enquiry";
import { AuthRequest } from "../middleware/auth";
import { sendEnquiryEmail, sendEnquirySms } from "../utils/notify";

// Public: submit a new enquiry (from the booking form)
export const createEnquiry = async (req: AuthRequest, res: Response) => {
  try {
    const {
      customerName,
      phoneNumber,
      eventType,
      eventDate,
      location,
      additionalDetails,
    } = req.body;

    if (!customerName || !phoneNumber || !eventType || !eventDate || !location) {
      return res.status(400).json({
        message:
          "customerName, phoneNumber, eventType, eventDate and location are required",
      });
    }

    const enquiry = await Enquiry.create({
      customerName,
      phoneNumber,
      eventType,
      eventDate,
      location,
      additionalDetails,
    });

    // Fire-and-forget notifications; do not block the response on delivery
    sendEnquiryEmail(enquiry).catch(() => undefined);
    sendEnquirySms(enquiry).catch(() => undefined);

    return res.status(201).json({
      message: "Enquiry submitted successfully. We will contact you shortly.",
      enquiry,
    });
  } catch (error) {
    return res.status(400).json({ message: "Failed to submit enquiry", error: (error as Error).message });
  }
};

// Admin: list all enquiries, newest first, optional status filter
export const getEnquiries = async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const enquiries = await Enquiry.find(filter).sort({ createdAt: -1 });
    return res.status(200).json(enquiries);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch enquiries" });
  }
};

// Admin: update enquiry status (Pending / Contacted / Closed)
export const updateEnquiryStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body;
    if (!["Pending", "Contacted", "Closed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const enquiry = await Enquiry.findByIdAndUpdate(
      req.params.id,
      { $set: { status } },
      { new: true }
    );

    if (!enquiry) return res.status(404).json({ message: "Enquiry not found" });

    return res.status(200).json(enquiry);
  } catch (error) {
    return res.status(400).json({ message: "Failed to update enquiry" });
  }
};

// Admin: delete an enquiry
export const deleteEnquiry = async (req: AuthRequest, res: Response) => {
  try {
    const enquiry = await Enquiry.findByIdAndDelete(req.params.id);
    if (!enquiry) return res.status(404).json({ message: "Enquiry not found" });

    return res.status(200).json({ message: "Enquiry deleted", id: req.params.id });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete enquiry" });
  }
};
