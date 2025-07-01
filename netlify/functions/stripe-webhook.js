const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const fetch = require('node-fetch');

exports.handler = async (event) => {
  const sig = event.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let stripeEvent;

  try {
    stripeEvent = stripe.webhooks.constructEvent(event.body, sig, endpointSecret);
  } catch (err) {
    console.error('❌ Webhook signature verification failed:', err.message);
    return {
      statusCode: 400,
      body: `Webhook Error: ${err.message}`,
    };
  }

  // ✅ Only handle successful payments
  if (stripeEvent.type === 'checkout.session.completed') {
    const session = stripeEvent.data.object;

    // 📦 Extract metadata
    const productId = session.metadata?.productId;
    const playerId = session.metadata?.playerId;
    const serverId = session.metadata?.serverId;

    if (!productId || !playerId || !serverId) {
      return {
        statusCode: 400,
        body: 'Missing metadata values.',
      };
    }

    try {
      // 📤 Call send-uc Netlify Function
      co
