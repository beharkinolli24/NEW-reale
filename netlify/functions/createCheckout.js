import Stripe from 'stripe';

const stripe = new Stripe('jMJieA1nIRMPXycSlbzQ3ModA5fohRnqa14NGLS0');

export async function handler(event) {
  const { amount, productId, playerId, serverId } = JSON.parse(event.body);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'eur',
        product_data: {
          name: `UC ${productId}`,
        },
        unit_amount: Math.round(amount * 100),
      },
      quantity: 1,
    }],
    mode: 'payment',
    success_url: 'https://trustucshop.com/success.html',
    cancel_url: 'https://trustucshop.com/cancel.html',
    metadata: {
      productId,
      playerId,
      serverId
    }
  });

  return {
    statusCode: 200,
    body: JSON.stringify({ url: session.url })
  };
}
