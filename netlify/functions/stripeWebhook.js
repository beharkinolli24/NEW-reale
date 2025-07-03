
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const axios = require('axios');

exports.handler = async (event) => {
  const sig = event.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  try {
    const stripeEvent = stripe.webhooks.constructEvent(event.body, sig, endpointSecret);

    if (stripeEvent.type === 'checkout.session.completed') {
      const session = stripeEvent.data.object;
      const metadata = session.metadata;

      await axios.post('https://api.u7buy.com/order/start_delivery', {
        productId: metadata.productId,
        playerId: metadata.playerId,
        serverId: metadata.serverId,
        quantity: 1
      }, {
        headers: {
          'Content-Type': 'application/json',
          'apiKey': process.env.U7BUY_API_KEY
        }
      });
    }

    return { statusCode: 200, body: JSON.stringify({ received: true }) };
  } catch (err) {
    console.error("Webhook error:", err.message);
    return { statusCode: 400, body: `Webhook error: ${err.message}` };
  }
};
