
import Stripe from 'stripe';
import fetch from 'node-fetch';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
const u7buyKey = process.env.U7BUY_API_KEY;

export const config = { api: { bodyParser: false } };

export default async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const rawBody = Buffer.concat(chunks);

    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const m = session.metadata || {};

    console.log('✅ Payment completed:', session.id, m);

    // Send UC via U7BUY
    try {
      const response = await fetch('https://openapi.u7buy.com/open-api/game_service_order/create_order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': u7buyKey
        },
        body: JSON.stringify({
          spuId: m.productId,
          gameAccountInfo: { account: m.playerId, roleName: 'TRUSTUC' },
          quantity: 1,
          externalOrderNumber: `trustuc-${Date.now()}`,
          buyerRemark: `${m.ucAmount} UC Auto`,
          region: 'GLOBAL'
        })
      }).then(r => r.json());

      console.log('U7BUY response:', response);
    } catch (err) {
      console.error('U7BUY delivery failed:', err);
    }
  }

  res.json({ received: true });
};
