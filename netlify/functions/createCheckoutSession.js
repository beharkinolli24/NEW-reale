const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  // Lejonly POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { productId, ucAmount, amount, playerId, serverId, email } = JSON.parse(event.body);

    // Kontroll fushash
    if (![productId, ucAmount, amount, playerId, serverId, email].every(Boolean)) {
      return { statusCode: 400, body: 'Missing fields' };
    }

    // Krijo sesionin e Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'eur',
            unit_amount: Math.round(amount * 100), // € → cent
            product_data: {
              name: `${ucAmount} UC – PUBG`,
              description: `Player ID: ${playerId} / Server ID: ${serverId}`
            }
          },
          quantity: 1
        }
      ],
      success_url: 'https://trustucshop.com/success.html',
      cancel_url:  'https://trustucshop.com/cancel.html',
      metadata: { productId, ucAmount, playerId, serverId, email }
    });

    return { statusCode: 200, body: JSON.stringify({ url: session.url }) };

  } catch (err) {
    console.error('Stripe session error:', err);
    return { statusCode: 500, body: JSON.stringify({ error: 'Stripe session error' }) };
  }
};
