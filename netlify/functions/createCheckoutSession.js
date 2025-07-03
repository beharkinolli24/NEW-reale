/* eslint-disable */
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

/**
 *  POST body expected:
 *  { productId, ucAmount, amount, playerId, serverId, email }
 */
exports.handler = async (event) => {
  try {
    const data = JSON.parse(event.body || '{}');

    // ✅ 1. Validim minimal
    const required = ['productId', 'ucAmount', 'amount', 'playerId', 'serverId', 'email'];
    for (const key of required) {
      if (!data[key]) {
        console.log('❌  Missing field:', key);
        return { statusCode: 400, body: `Missing ${key}` };
      }
    }

    // ✅ 2. Krijo sesionin
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [{
        price_data: {
          currency: 'eur',
          unit_amount: Math.round(Number(data.amount) * 100),
          product_data: {
            name: `${data.ucAmount} UC – PUBG`,
            description: `Player ID: ${data.playerId} | Server ID: ${data.serverId}`
          }
        },
        quantity: 1
      }],
      success_url: `${process.env.SUCCESS_URL || 'https://your-site.com/success'}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${process.env.CANCEL_URL  || 'https://your-site.com/cancel'}`,
      metadata: {
        productId : data.productId,
        playerId  : data.playerId,
        serverId  : data.serverId,
        ucAmount  : data.ucAmount,
        email     : data.email
      }
    });

    console.log('✅ Session created:', session.id);
    return { statusCode: 200, body: JSON.stringify({ url: session.url }) };

  } catch (err) {
    console.error('🔥 Stripe error:', err);
    return { statusCode: 500, body: 'Stripe error' };
  }
};
