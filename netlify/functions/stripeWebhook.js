import Stripe from 'stripe';

const stripe = new Stripe('jMJieA1nIRMPXycSlbzQ3ModA5fohRnqa14NGLS0');
const endpointSecret = 'whsec_C3DD4DI4IHKqOWfzN1qQx4Gb0PEPq7kh';

export async function handler(event) {
  const sig = event.headers['stripe-signature'];
  let session;

  try {
    session = stripe.webhooks.constructEvent(event.body, sig, endpointSecret);
  } catch (err) {
    return {
      statusCode: 400,
      body: `Webhook error: ${err.message}`
    };
  }

  if (session.type === 'checkout.session.completed') {
    const metadata = session.data.object.metadata;

    const sendUCRes = await fetch(`${process.env.URL || 'https://trustucshop.com'}/.netlify/functions/sendUC`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId: metadata.productId,
        playerId: metadata.playerId,
        serverId: metadata.serverId
      })
    });

    const result = await sendUCRes.json();
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'UC sent', result })
    };
  }

  return {
    statusCode: 200,
    body: 'Event received'
  };
}
