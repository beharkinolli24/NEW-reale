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
      body: JSON.stringify({
        error: 'productId, playerId dhe serverId janë të detyrueshme'
      })
    };
  }

  /* ── 3. Lexo API-key nga env vars ───────────────────── */
  const API_KEY = process.env.U7BUY_API_KEY;
  if (!API_KEY) {
    console.error('❌ Env var U7BUY_API_KEY mungon!');
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'U7BUY_API_KEY është i munguar në env vars'
      })
    };
  }

  /* ── 4. Thirrja tek U7BUY Open API ──────────────────── */
  try {
    console.log('👉 Po dërgojmë kërkesë:', {
      productId,
      playerId,
      serverId
    });

    const response = await fetch(
      'https://open-api.u7buy.com/api/order/start_delivery',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ productId, playerId, serverId })
      }
    );

    console.log('🔙 Status nga U7BUY:', response.status);

    const data = await response.json().catch(() => null);

    if (response.ok && data && data.status === 'success') {
      console.log('✅ UC u dërgua me sukses', data);
      return {
        statusCode: 200,
        body: JSON.stringify({
          ok: true,
          message: 'UC u dërgua me sukses',
          data
        })
      };
    }

    console.warn('⚠️ Dërgimi dështoi', data);
    return {
      statusCode: 400,
      body: JSON.stringify({
        ok: false,
        message: 'Dërgimi dështoi',
        data
      })
    };
  } catch (err) {
    console.error('❌ Fetch failed:', err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message || 'fetch failed' })
    };
  }
};
