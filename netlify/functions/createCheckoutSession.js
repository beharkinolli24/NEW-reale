import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end('Only POST');

  try {
    const { productId, ucAmount, amount, playerId, serverId, email } = req.body;
    if (![productId, ucAmount, amount, playerId, serverId, email].every(Boolean)) {
      return res.status(400).json({ error: 'Missing field(s).' });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode       : 'payment',
      line_items : [{
        price_data: {
          currency: 'eur',
          unit_amount: Math.round(amount * 100),
          product_data: {
            name: `${ucAmount} UC – PUBG`,
            description: `Player ${playerId} / Server ${serverId}`
          }
        },
        quantity: 1
      }],
      success_url: `${process.env.PUBLIC_URL}/success.html`,
      cancel_url : `${process.env.PUBLIC_URL}/cancel.html`,
      metadata   : { productId, playerId, serverId, ucAmount, email }
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Stripe error:', err);
    res.status(500).json({ error: 'Stripe error' });
  }
};
