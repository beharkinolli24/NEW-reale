
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { productId, ucAmount, amount, playerId, email } = JSON.parse(event.body);

    console.log("🟢 Received body:", { productId, ucAmount, amount, playerId, email });

    if (![productId, ucAmount, amount, playerId].every(Boolean)) {
      console.error("🔴 Missing fields in body!");
      return { statusCode: 400, body: 'Missing fields' };
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [{
        price_data: {
          currency: 'eur',
          unit_amount: Math.round(parseFloat(amount) * 100),
          product_data: {
            name: `${ucAmount} UC – PUBG`,
            description: `PUBG ID: ${playerId}`
          }
        },
        quantity: 1
      }],
      success_url: `https://trustucshop.com/success.html`,
      cancel_url: `https://trustucshop.com/cancel.html`,
      metadata: { productId, ucAmount, playerId, email }
    });

    console.log("🟢 Session created:", session.id);

    return {
      statusCode: 200,
      body: JSON.stringify({ url: session.url })
    };

  } catch (err) {
    console.error("🔴 Stripe error:", err.message);
    if (err.param) console.error("🔴 Param:", err.param);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: err.message,
        param: err.param || null
      })
    };
  }
};
