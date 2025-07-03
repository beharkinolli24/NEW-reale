/* eslint-disable */
const stripe  = require('stripe')(process.env.STRIPE_SECRET_KEY);
const crypto  = require('crypto');
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

exports.handler = async (event) => {
  const sig = event.headers['stripe-signature'];
  let stripeEvent;

  try {
    stripeEvent = stripe.webhooks.constructEvent(event.body, sig, endpointSecret);
  } catch (err) {
    console.error('🚫  Webhook signature failed:', err.message);
    return { statusCode: 400, body: `Webhook Error: ${err.message}` };
  }

  // ✅ Vetëm kur pagesa përfundon
  if (stripeEvent.type === 'checkout.session.completed') {
    const session = stripeEvent.data.object;
    console.log('✅ Payment succeeded for session', session.id);

    // 👉  Këtu mund të dërgosh UC ose të ruash porosinë
    // p.sh. call finalizeOrder(session);

  }
  return { statusCode: 200, body: 'ok' };
};
