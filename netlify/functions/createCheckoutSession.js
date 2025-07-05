const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  /* ── 1. Vetëm POST ──────────────────────────────── */
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Only POST allowed' };
  }

  /* ── 2. Parsimi i body ──────────────────────────── */
  let body;
  try { body = JSON.parse(event.body || '{}'); }
  catch { return { statusCode: 400, body: 'Body must be JSON' }; }

  const { playerId, ucAmount, amount } = body;
  const price = amount;                               // ruaj si price

  if (!playerId || !ucAmount || !price) {
    return { statusCode: 400, body: 'Missing fields' };
  }

  /* ── 3. Krijo Stripe Checkout Session ───────────── */
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: { name: `${ucAmount} UC – PUBG Mobile` },
          unit_amount: Math.round(price * 100)          // € → cent
        },
        quantity: 1
      }],
      payment_intent_data: {
        capture_method: 'manual'                        // vetëm authorisation
      },
      metadata: { playerId, ucAmount },
      success_url: 'https://trustucshop.com/success',
      cancel_url:  'https://trustucshop.com/cancel'
    });

    return { statusCode: 200, body: JSON.stringify({ url: session.url }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
