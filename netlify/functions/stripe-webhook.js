// netlify/functions/stripeWebhook.js
const Stripe   = require('stripe');
const { google } = require('googleapis');
const nodemailer = require('nodemailer');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16'
});

exports.handler = async (event) => {
  /* 1️⃣ – Verifikojmë sinjalin e Stripe */
  const sig = event.headers['stripe-signature'];
  let stripeEvent;

  try {
    stripeEvent = stripe.webhooks.constructEvent(
      event.body,               // <<< raw body si string
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature failed:', err.message);
    return { statusCode: 400, body: `Webhook Error: ${err.message}` };
  }

  /* 2️⃣ – Kur përfundon Checkout-i */
  if (stripeEvent.type === 'checkout.session.completed') {
    const session = stripeEvent.data.object;
    const { metadata, amount_total, customer_details } = session;

    /* ➜ Ruajmë në Google Sheet */
    try {
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
        requestBody: { values: [[
          new Date().toISOString(),
          metadata.package,
          metadata.playerId,
          customer_details.email,
          (amount_total / 100).toFixed(2)
        ]] }
      });
    } catch (err) {
      console.error('Sheets error:', err);
    }

    /* ➜ Dërgojmë email njoftues */
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      await transporter.sendMail({
        from: '"Trust UC Shop" <no-reply@trustucshop.com>',
        to: process.env.NOTIFY_EMAIL,
        subject: `Porosi e re – ${metadata.package}`,
        text: `Player ID: ${metadata.playerId}
Email klienti: ${customer_details.email}
Paketa: ${metadata.package}
Shuma: €${(amount_total / 100).toFixed(2)}`
      });
    } catch (err) {
      console.error('Email error:', err);
    }
  }

  /* 3️⃣ – Përgjigjemi OK që Stripe të mos ritentojë */
  return { statusCode: 200, body: JSON.stringify({ received: true }) };
};
