// netlify/functions/startDelivery.js
exports.handler = async (event) => {
  /* — 1. Lejo vetëm POST — */
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Only POST requests allowed' };
  }

  /* — 2. Merr body-n si JSON — */
  let input;
  try { input = JSON.parse(event.body); }
  catch { return { statusCode: 400, body: 'Body must be valid JSON' }; }

  const { productId, playerId, serverId } = input;
  if (!productId || !playerId || !serverId) {
    return { statusCode: 400, body: 'productId, playerId dhe serverId required' };
  }

  /* — 3. Tokeni Base-64 nga env vars — */
  const TOKEN = process.env.U7BUY_B64_TOKEN;           // ← vendose në Netlify
  if (!TOKEN) { return { statusCode: 500, body: 'U7BUY_B64_TOKEN missing' }; }

  /* — 4. Thirrja te U7BUY prod-API — */
  const url = 'https://openapi.u7buy.com/prod-api/open-api/order/start_delivery';

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${TOKEN}`,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        bo: { productId, playerId, serverId }   // formati që kërkon U7BUY
      })
    });

    const raw = await res.text();               // përgjigjja bruto
    let data; try { data = JSON.parse(raw); } catch { /** jo JSON */ }

    if (res.ok && data?.code === 200) {
      return { statusCode: 200, body: raw };    // ✅ sukses
    }
    return { statusCode: res.status, body: raw }; // çdo gabim pasqyroje

  } catch (err) {
    return { statusCode: 500, body: err.message };
  }
};
