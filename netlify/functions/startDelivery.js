// netlify/functions/startDelivery.js
exports.handler = async (event) => {
  /* 1 ▸ Lejo vetëm POST */
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Only POST requests allowed' };
  }

  /* 2 ▸ Parsing */
  let dataIn;
  try { dataIn = JSON.parse(event.body); }
  catch { return { statusCode: 400, body: 'Body must be valid JSON' }; }

  const { productId, playerId, serverId } = dataIn;
  if (!productId || !playerId || !serverId) {
    return { statusCode: 400, body: 'productId, playerId, serverId required' };
  }

  /* 3 ▸ Token Basic64 nga env vars */
  const TOKEN = process.env.U7BUY_B64_TOKEN;   // vendose në Netlify
  if (!TOKEN) { return { statusCode: 500, body: 'U7BUY_B64_TOKEN missing' }; }

  /* 4 ▸ Thirrja drejt prod-api */
  const url =
    'https://openapi.u7buy.com/prod-api/open-api/order/start_delivery';

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${TOKEN}`,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        bo: { productId, playerId, serverId }   // ← formati që kërkon API
      })
    });

    const raw = await res.text();
    let data; try { data = JSON.parse(raw); } catch { /* non-JSON */ }

    if (res.ok && data?.code === 200) {
      return { statusCode: 200, body: raw };
    }
    return { statusCode: res.status, body: raw };

  } catch (err) {
    return { statusCode: 500, body: err.message };
  }
};
