const { GoogleSpreadsheet } = require('google-spreadsheet');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const creds = require('./credentials.json');

exports.handler = async (event) => {
  const sig = event.headers['stripe-signature'];
  let eventData;

  try {
    eventData = stripe.webhooks.constructEvent(event.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return { statusCode: 400, body: `Webhook error: ${err.message}` };
  }

  if (eventData.type === 'checkout.session.completed') {
    const session = eventData.data.object;
    const { productId, playerId, serverId, ucAmount, email } = session.metadata;

    const doc = new GoogleSpreadsheet('1-6lmqLmaVZvqt23dXJ2QXdPbu4nBjFF61uhUybLv_y0');
    await doc.useServiceAccountAuth(creds);
    await doc.loadInfo();

    const sheet = doc.sheetsByIndex[0];
    await sheet.addRow({
      'Data & Ora': new Date().toLocaleString(),
      'Player ID': playerId,
      'Server ID': serverId,
      'Email': email,
      'Paketa UC': ucAmount,
      'Çmimi (€)': session.amount_total / 100,
      'Status': 'Sukses',
    });
  }

  return { statusCode: 200, body: JSON.stringify({ received: true }) };
};