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

const messages: Record<string, string> = {
  confirmed: "has been confirmed",
  quoted: "has received a quote — check your email/WhatsApp for details",
  closed: "has been closed",
};

export async function POST(req: Request) {
  const { id, name, email, whatsapp, status } = await req.json();
  const errors: string[] = [];

  const shortId = id.slice(0, 8).toUpperCase();
  const statusText = messages[status] || `status changed to ${status}`;

  if (email) {
    try {
      await transporter.sendMail({
        from: `"Zarbia" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: `Your order #${shortId} ${statusText}`,
        html: `
          <div style="font-family: Georgia, serif; max-width: 480px; margin: 0 auto; padding: 32px; color: #2b2320;">
            <h1 style="font-size: 20px; letter-spacing: 1px; text-transform: uppercase; border-bottom: 2px solid #b5651d; padding-bottom: 12px;">Zarbia</h1>
            <p style="font-size: 16px; margin-top: 24px;">Hi ${name},</p>
            <p style="font-size: 15px; line-height: 1.6;">
              Your custom order <strong>#${shortId}</strong> ${statusText}.
            </p>
            <p style="font-size: 15px; line-height: 1.6;">
              We'll be in touch shortly with next steps.
            </p>
            <p style="margin-top: 32px; font-size: 13px; color: #8a8078;">— Zarbia</p>
          </div>
        `,
      });
    } catch (err) {
      errors.push(`Email failed: ${(err as Error).message}`);
    }
  }

  if (whatsapp) {
    try {
      await twilioClient.messages.create({
        body: `Zarbia: Your order #${shortId} for ${name} ${statusText}.`,
        from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
        to: `whatsapp:${whatsapp}`,
      });
    } catch (err) {
      errors.push(`WhatsApp failed: ${(err as Error).message}`);
    }
  }

  return Response.json({ ok: errors.length === 0, errors });
}