// netlify/functions/startDelivery.js
exports.handler = async (event) => {
  /* ── 1. Lejo vetëm POST ─────────────────────────────── */
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Only POST requests allowed' })
    };
  }

  /* ── 2. Merr të dhënat nga body ─────────────────────── */
  let parsed;
  try {
    parsed = JSON.parse(event.body);
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Body must be valid JSON' })
    };
  }

  const { productId, playerId, serverId } = parsed;
  if (!productId || !playerId || !serverId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'productId, playerId dhe serverId janë të detyrueshme' })
    };
  }

  /* ── 3. Çelësi i U7BUY merret nga Environment Vars ─── */
  const API_KEY = process.env.U7BUY_API_KEY;
             // ↖︎ fute në Netlify → Site → Environment variables
  if (!API_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'U7BUY_KEY është i munguar në env vars' })
    };
  }

  /* ── 4. Thirrja tek U7BUY API ───────────────────────── */
  try {
    const response = await fetch('https://api.u7buy.com/order/start_delivery', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ productId, playerId, serverId })
    });

    const data = await response.json();

    if (response.ok && data.status === 'success') {
      return {
        statusCode: 200,
        body: JSON.stringify({ ok: true, message: 'UC u dërgua me sukses', data })
      };
    }

    return {
      statusCode: 400,
      body: JSON.stringify({ ok: false, message: 'Dërgimi dështoi', data })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
