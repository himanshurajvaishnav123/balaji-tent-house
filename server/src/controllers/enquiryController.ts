import { Request, Response } from 'express';
import { Enquiry } from '../models/Enquiry.js';

export const createEnquiry = async (req: Request, res: Response): Promise<void> => {
  try {
    const { customerName, phone, eventType, eventDate, location, details } = req.body;

    if (!customerName || !phone) {
      res.status(400).json({
        success: false,
        message: 'Name and Phone Number are required to submit an enquiry.',
      });
      return;
    }

    const enquiry = await Enquiry.create({
      customerName: customerName.trim(),
      phone: phone.trim(),
      eventType: eventType || 'Wedding / Vivah',
      eventDate: eventDate || '',
      location: location || 'Bijoliya / Nearby',
      details: details || '',
      status: 'Pending',
    });

    res.status(201).json({
      success: true,
      message: 'Thank you! Your enquiry has been received. Yamuna Shankar Bairagi (+919783950350) will contact you soon.',
      enquiry,
    });
  } catch (error: any) {
    console.error('createEnquiry error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit enquiry. Please call us directly at +919783950350.',
      error: error.message,
    });
  }
};

export const getEnquiries = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = req.query;
    const filter = status && status !== 'All' ? { status } : {};
    const enquiries = await Enquiry.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: enquiries.length,
      enquiries,
    });
  } catch (error: any) {
    console.error('getEnquiries error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch enquiries.',
      error: error.message,
    });
  }
};

export const updateEnquiryStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['Pending', 'Contacted', 'Resolved'].includes(status)) {
      res.status(400).json({
        success: false,
        message: 'Status must be Pending, Contacted, or Resolved.',
      });
      return;
    }

    const enquiry = await Enquiry.findById(id);
    if (!enquiry) {
      res.status(404).json({
        success: false,
        message: 'Enquiry not found.',
      });
      return;
    }

    enquiry.status = status;
    await enquiry.save();

    res.status(200).json({
      success: true,
      message: `Enquiry status updated to "${status}".`,
      enquiry,
    });
  } catch (error: any) {
    console.error('updateEnquiryStatus error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update enquiry status.',
      error: error.message,
    });
  }
};

export const deleteEnquiry = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const enquiry = await Enquiry.findByIdAndDelete(id);

    if (!enquiry) {
      res.status(404).json({
        success: false,
        message: 'Enquiry not found.',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Enquiry deleted successfully.',
    });
  } catch (error: any) {
    console.error('deleteEnquiry error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete enquiry.',
      error: error.message,
    });
  }
};
