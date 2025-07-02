
const stripe = require('stripe')('sk_live_jMJieA1nIRMPXycSlbzQ3ModA5fohRnqa14NGLS0');
const axios = require('axios');

exports.handler = async (event) => {
  const sig = event.headers['stripe-signature'];
  const endpointSecret = 'whsec_C3DD4DI4IHKqOWfzN1qQx4Gb0PEPq7kh';

  let stripeEvent;

  try {
    stripeEvent = stripe.webhooks.constructEvent(event.body, sig, endpointSecret);

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
          'apiKey': 'ivGuB4iP0FKkl6U3lbZYLFxRYJiGd0mnaXI7rgLi'
        }
      });
    }

    return { statusCode: 200, body: JSON.stringify({ received: true }) };

  } catch (err) {
    console.error("Webhook error:", err.message);
    return { statusCode: 400, body: `Webhook error: ${err.message}` };
  }
};
