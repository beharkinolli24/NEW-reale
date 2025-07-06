// netlify/functions/createCheckoutSession.js
const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16'
});

exports.handler = async (event) => {
  // Prano vetëm POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  // Netlify e jep body-n si string (apo objekt, varet nga bundler) – thjesht sigurohemi.
  let data;
  try {
    data = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
  } catch {
    return { statusCode: 400, body: 'Invalid JSON body' };
  }

  const { priceEur, playerId, packageName } = data || {};
  if (!priceEur || !playerId || !packageName) {
    return { statusCode: 400, body: 'Missing parameters' };
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: { name: `${packageName} – PUBG Mobile` },
            unit_amount: Math.round(Number(priceEur) * 100) // € → cent
          },
          quantity: 1
        }
      ],
      metadata: { playerId, package: packageName },
      payment_intent_data: { capture_method: 'automatic' },
      success_url: `${process.env.DOMAIN}/success`,
      cancel_url : `${process.env.DOMAIN}/cancel`
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ url: session.url })
    };
  } catch (err) {
    console.error('Stripe error', err);
    return { statusCode: 500, body: 'Stripe error' };
  }
};
