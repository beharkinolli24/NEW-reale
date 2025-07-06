import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

  try {
    // Nga body merr çmimin, playerId dhe emrin e paketës
    const { priceEur, playerId, packageName } = JSON.parse(req.body);

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: { name: `${packageName} – PUBG Mobile` },
            unit_amount: Math.round(priceEur * 100), // €0.55 → 55
          },
          quantity: 1,
        },
      ],
      metadata: { playerId, package: packageName },
      payment_intent_data: { capture_method: 'automatic' }, // kapet menjëherë
      success_url: `${process.env.NEXT_PUBLIC_DOMAIN}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_DOMAIN}/cancel`,
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Stripe error', err);
    res.status(500).json({ error: 'Stripe session error' });
  }
}
