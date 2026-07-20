import nodemailer from "nodemailer";
import twilio from "twilio";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function sendOrderConfirmedNotification(order: {
  id: string;
  name: string;
  email?: string;
  phone?: string;
}) {
  const results: { email?: boolean; sms?: boolean; errors: string[] } = {
    errors: [],
  };

  // Email
  if (order.email) {
    try {
      await transporter.sendMail({
        from: `"Zarbia" <${process.env.GMAIL_USER}>`,
        to: order.email,
        subject: `Your order #${order.id} has been confirmed`,
        text: `Hi ${order.name},\n\nYour custom order #${order.id} has been confirmed. We'll be in touch with next steps.\n\n— Zarbia`,
      });
      results.email = true;
    } catch (err) {
      results.errors.push(`Email failed: ${(err as Error).message}`);
    }
  }

  // SMS
  if (order.phone) {
    try {
      await twilioClient.messages.create({
        body: `Zarbia: Order #${order.id} for ${order.name} has been confirmed.`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: order.phone,
      });
      results.sms = true;
    } catch (err) {
      results.errors.push(`SMS failed: ${(err as Error).message}`);
    }
  }

  return results;
}