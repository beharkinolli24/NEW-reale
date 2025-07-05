const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { google } = require('googleapis');
const nodemailer = require('nodemailer');

exports.handler = async (event) => {
  const sig = event.headers['stripe-signature'];
  let stripeEvent;

  try {
    stripeEvent = stripe.webhooks.constructEvent(
      event.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (e) {
    return { statusCode: 400, body: `Webhook error: ${e.message}` };
  }

  if (stripeEvent.type !== 'checkout.session.completed') {
    return { statusCode: 200, body: 'Event ignored' };
  }

  const s        = stripeEvent.data.object;
  const playerId = s.metadata.playerId;
  const ucAmount = s.metadata.ucAmount;
  const email    = s.customer_details?.email || 'N/A';

  /* 1 ▸ Shkruaj në Google Sheet */
  const auth = new google.auth.JWT(
    process.env.GS_CLIENT_EMAIL,
    null,
    process.env.GS_PRIVATE_KEY.replace(/\\n/g, '\n'),
    ['https://www.googleapis.com/auth/spreadsheets']
  );

  const sheets = google.sheets({ version: 'v4', auth });
  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.GS_SHEET_ID,
    range: 'Orders!A:E',
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[new Date().toISOString(), playerId, ucAmount, email, s.payment_intent]]
    }
  });

  /* 2 ▸ Dërgo email njoftimi */
  const mailer = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.NOTIFY_EMAIL,
      pass: process.env.NOTIFY_PASS
    }
  });

  await mailer.sendMail({
    from: process.env.NOTIFY_EMAIL,
    to:   process.env.NOTIFY_EMAIL,
    subject: `🛒 Porosi e re – ${ucAmount} UC`,
    text: `Player ID: ${playerId}\nPako: ${ucAmount} UC\nEmail klienti: ${email}`
  });

  return { statusCode: 200, body: 'ok' };
};
