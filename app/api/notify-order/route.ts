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

export async function POST(req: Request) {
  const { id, name, email, whatsapp } = await req.json();
  const errors: string[] = [];

  if (email) {
    try {
      await transporter.sendMail({
        from: `"Zarbia" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: `Your order has been confirmed`,
        text: `Hi ${name},\n\nYour custom order (#${id}) has been confirmed. We'll be in touch with next steps.\n\n— Zarbia`,
      });
    } catch (err) {
      errors.push(`Email failed: ${(err as Error).message}`);
    }
  }

  if (whatsapp) {
    try {
      await twilioClient.messages.create({
        body: `Zarbia: Your order #${id} for ${name} has been confirmed.`,
        from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
        to: `whatsapp:${whatsapp}`,
      });
    } catch (err) {
      errors.push(`WhatsApp failed: ${(err as Error).message}`);
    }
  }

  return Response.json({ ok: errors.length === 0, errors });
}