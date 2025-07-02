
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  try {
    const { playerId, serverId, productId, amount, ucAmount } = JSON.parse(event.body);

    if (!playerId || !serverId || !productId || !amount || !ucAmount) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Të dhëna të paplota" }),
      };
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: {
            name: `${ucAmount} UC`,
          },
          unit_amount: Math.round(amount * 100),
        },
        quantity: 1,
      }],
      metadata: {
        playerId,
        serverId,
        productId
      },
      success_url: 'https://trustucshop.com/success',
      cancel_url: 'https://trustucshop.com/cancel'
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ url: session.url }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
