import Stripe from 'stripe';
import { google } from 'googleapis';
import nodemailer from 'nodemailer';
import { Readable } from 'stream';

export const config = { api: { bodyParser: false } };

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

// ➜ Ruajtja në Google Sheets
async function appendToSheet(row) {
  const auth = new google.auth.JWT(
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    null,
    process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    ['https://www.googleapis.com/auth/spreadsheets']
  );
  const sheets = google.sheets({ version: 'v4', auth });

  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.SHEET_ID,
    range: 'A1',
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [row] },
  });
}

// ➜ Dërgimi i e-mailit
async function sendNotification({ subject, text }) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });
  await transporter.sendMail({
    from: '"Trust UC Shop" <no-reply@trustucshop.com>',
    to: process.env.NOTIFY_EMAIL,
    subject,
    text,
  });
}

// ➜ Konverton stream-in raw të trupit
function buffer(readable) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    readable.on('data', (c) => chunks.push(c));
    readable.on('end', () => resolve(Buffer.concat(chunks)));
    readable.on('error', reject);
  });
}

export default async function handler(req, res) {
  let event;

  try {
    const rawBody = await buffer(req);
    const sig = req.headers['stripe-signature'];
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature failed', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const { metadata, amount_total, customer_details } = session;

    // 1️⃣ Sheets
    try {
      await appendToSheet([
        new Date().toISOString(),     // Datë
        metadata.package,             // Paketa (p.sh. 60 UC)
        metadata.playerId,            // Player ID
        customer_details.email,       // Emaili i klientit
        amount_total / 100,           // Shuma €
      ]);
    } catch (err) {
      console.error('Sheets error', err);
    }

    // 2️⃣ E-mail njoftues
    try {
      await sendNotification({
        subject: `Porosi e re – ${metadata.package}`,
        text: `Player ID: ${metadata.playerId}
Email klienti: ${customer_details.email}
Shuma: €${amount_total / 100}`,
      });
    } catch (err) {
      console.error('Email error', err);
    }
  }

  res.status(200).json({ received: true });
}
