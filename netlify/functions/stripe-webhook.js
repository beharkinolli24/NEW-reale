
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const fetch  = require('node-fetch');

exports.handler = async (event) => {
  const sig     = event.headers['stripe-signature'];
  const secret  = process.env.STRIPE_WEBHOOK_SECRET;
  let stripeEvent;

  try {
    stripeEvent = stripe.webhooks.constructEvent(event.body, sig, secret);
  } catch (err) {
    console.error('❌  Webhook signature mismatch:', err.message);
    return { statusCode: 400, body: `Webhook Error: ${err.message}` };
  }

  if (stripeEvent.type === 'checkout.session.completed') {
    const session  = stripeEvent.data.object;

    const pubgId   = session.metadata.playerId;
    const ucAmount = session.metadata.ucAmount;
    const email    = session.customer_details?.email || session.metadata.email;

    console.log('🟢  Pagesa OK. Po dërgojmë UC...', { pubgId, ucAmount });

    try {
      await sendUC(pubgId, ucAmount);
      console.log('✅  UC u dërgua me sukses');
    } catch (err) {
      console.error('❌  Dështoi sendUC:', err.message);
    }

    try {
      await fetch('https://trustuc-proxy.onrender.com/submit', {
        method:'POST',
        headers:{ 'Content-Type':'application/json' },
        body: JSON.stringify({
          pubg_id : pubgId,
          paketa  : `${ucAmount} UC`,
          shuma   : (session.amount_total / 100).toFixed(2),
          email
        })
      });
      console.log('🗒️  Porosia u regjistrua në Sheets');
    } catch (e) {
      console.warn('⚠️  Sheets logging failed:', e.message);
    }
  }

  return { statusCode: 200, body: 'ok' };
};

async function sendUC(pubgId, ucAmount){
  const spuMap = {
    "30"  : 123456789,
    "60"  : 1938299181721538561,
    "325" : 1938299181721538561,
    "660" : 1938300815303401474,
    "1800": 1931436511665717249,
    "3850": 1898646498683515844,
    "8100": 1909194994574553089
  };

  const orderBody = {
    spuId: spuMap[ucAmount],
    gameAccountInfo:{ account: pubgId, roleName:"TRUST UC" },
    quantity: 1,
    externalOrderNumber:`trustuc-${Date.now()}`,
    buyerRemark:`${ucAmount} UC Auto`,
    region:"GLOBAL"
  };

  const res  = await fetch('https://openapi.u7buy.com/open-api/game_service_order/create_order', {
    method:'POST',
    headers:{
      'Content-Type':'application/json',
      'Authorization':'Basic ivGuB4iP0FKkl6U3lbZYLFxRYJiGd0mnaXI7rgLi'
    },
    body: JSON.stringify(orderBody)
  });

  const data = await res.json();
  if (data.code !== '000000') throw new Error(data.message || 'U7BUY error');
}
