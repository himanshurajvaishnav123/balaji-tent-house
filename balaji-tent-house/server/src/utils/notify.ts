import nodemailer from "nodemailer";
import type { IEnquiry } from "../models/Enquiry";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 465,
  secure: process.env.SMTP_SECURE !== "false",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendEnquiryEmail = async (enquiry: IEnquiry): Promise<void> => {
  const to = process.env.OWNER_NOTIFICATION_EMAIL;
  if (!to || !process.env.SMTP_USER) {
    console.warn("Email notification skipped: SMTP not configured");
    return;
  }

  const html = `
    <h2>New Enquiry - BALAJI TENT HOUSE</h2>
    <p><strong>Name:</strong> ${enquiry.customerName}</p>
    <p><strong>Phone:</strong> ${enquiry.phoneNumber}</p>
    <p><strong>Event Type:</strong> ${enquiry.eventType}</p>
    <p><strong>Event Date:</strong> ${new Date(
      enquiry.eventDate
    ).toLocaleDateString("en-IN")}</p>
    <p><strong>Location:</strong> ${enquiry.location}</p>
    <p><strong>Details:</strong> ${enquiry.additionalDetails || "-"}</p>
  `;

  try {
    await transporter.sendMail({
      from: `"BALAJI TENT HOUSE Website" <${process.env.SMTP_USER}>`,
      to,
      subject: `New Enquiry: ${enquiry.customerName} (${enquiry.eventType})`,
      html,
    });
  } catch (error) {
    console.error("Failed to send enquiry email:", (error as Error).message);
  }
};

/**
 * Optional SMS notification via Twilio.
 * Enable by setting TWILIO_ENABLED=true and filling in credentials in .env
 * Install with: npm install twilio
 */
export const sendEnquirySms = async (enquiry: IEnquiry): Promise<void> => {
  if (process.env.TWILIO_ENABLED !== "true") return;

  try {
    // Lazy-require so the twilio package is only needed if this feature is enabled
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const twilio = require("twilio");
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    await client.messages.create({
      body: `New enquiry from ${enquiry.customerName} (${enquiry.phoneNumber}) for ${enquiry.eventType} on ${new Date(
        enquiry.eventDate
      ).toLocaleDateString("en-IN")}. Location: ${enquiry.location}`,
      from: process.env.TWILIO_FROM_NUMBER,
      to: process.env.OWNER_NOTIFICATION_PHONE,
    });
  } catch (error) {
    console.error("Failed to send enquiry SMS:", (error as Error).message);
  }
};
