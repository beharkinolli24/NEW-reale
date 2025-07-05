const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Only POST allowed' };
  }

  const { playerId, productId, price } = JSON.parse(event.body);

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: { name: `PUBG UC – ${productId}` },
          unit_amount: Math.round(price * 100)
        },
        quantity: 1
      }],
      metadata: { playerId, productId, ucAmount: productId },
      success_url: 'https://trustucshop.com/success',
      cancel_url:  'https://trustucshop.com/cancel'
    });

    return { statusCode: 200, body: JSON.stringify({ url: session.url }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
