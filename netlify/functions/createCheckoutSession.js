
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  try {
    const data = JSON.parse(event.body);
    const { productId, playerId, serverId, amount, ucAmount } = data;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [{
        price_data: {
          currency: 'eur',
          unit_amount: Math.round(amount * 100),
          product_data: {
            name: `${ucAmount} UC – PUBG`,
            description: `Player ID: ${playerId} | Server ID: ${serverId}`,
          },
        },
        quantity: 1,
      }],
      success_url: 'https://trustucshop.com/success',
      cancel_url: 'https://trustucshop.com/cancel',
      metadata: {
        productId,
        playerId,
        serverId,
        ucAmount
      }
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ url: session.url })
    };
  } catch (error) {
    console.error("❌ Stripe ERROR:", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
