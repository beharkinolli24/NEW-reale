const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  const sig = event.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let stripeEvent;

  try {
    stripeEvent = stripe.webhooks.constructEvent(event.body, sig, endpointSecret);
  } catch (err) {
    console.error('⚠️ Webhook signature verification failed.', err.message);
    return {
      statusCode: 400,
      body: `Webhook Error: ${err.message}`,
    };
  }

  if (stripeEvent.type === 'checkout.session.completed') {
    const session = stripeEvent.data.object;
    const { productId, playerId, serverId } = session.metadata;

    // Call send-uc Netlify Function
    try {
      const response = await fetch('https://trustucshop.com/.netlify/functions/send-uc', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ productId, playerId, serverId })
});

      const data = await response.json();
      console.log('✅ UC sent:', data);
    } catch (error) {
      console.error('❌ Error calling send-uc:', error);
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ received: true }),
  };
};
