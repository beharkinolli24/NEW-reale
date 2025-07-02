
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const https = require('https');

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

exports.handler = async (event) => {
  const sig = event.headers['stripe-signature'];
  let stripeEvent;

  try {
    stripeEvent = stripe.webhooks.constructEvent(event.body, sig, endpointSecret);
  } catch (err) {
    return {
      statusCode: 400,
      body: `Webhook Error: ${err.message}`,
    };
  }

  if (stripeEvent.type === 'checkout.session.completed') {
    const session = stripeEvent.data.object;

    const playerId = session.metadata.playerId;
    const serverId = session.metadata.serverId;
    const productId = session.metadata.productId;

    const data = JSON.stringify({
      productId,
      buyerPlayerId: playerId,
      buyerServerId: serverId
    });

    const options = {
      hostname: 'open-api.u7buy.com',
      path: '/open-api/order/start_delivery',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ivGuB4iP0FKkl6U3lbZYLFxRYJiGd0mnaXI7rgLi',
        'Content-Length': data.length
      }
    };

    await new Promise((resolve, reject) => {
      const req = https.request(options, res => {
        res.on('data', d => process.stdout.write(d));
        res.on('end', resolve);
      });

      req.on('error', reject);
      req.write(data);
      req.end();
    });
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ received: true }),
  };
};
