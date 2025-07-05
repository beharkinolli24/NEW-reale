// netlify/functions/startDelivery.js
exports.handler = async (event) => {
  /* 1 ▸ Lejo vetëm POST */
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Only POST requests allowed' })
    };
  }

  /* 2 ▸ Merr body-n si JSON */
  let parsed;
  try {
    parsed = JSON.parse(event.body);
  } catch {
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

  /* 3 ▸ API-key nga env vars */
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

  /* 4 ▸ Thirrja tek U7BUY Open-API */
  try {
    console.log('👉 Po dërgojmë kërkesë:', { productId, playerId, serverId });

    const response = await fetch(
      'https://www.u7buy.com/open-api/order/start_delivery',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ productId, playerId, serverId })
      }
    );

    /* 5 ▸ Lexo përgjigjen si tekst + provo JSON */
    const raw = await response.text();
    let data = null;
    try { data = JSON.parse(raw); } catch { /* jo JSON */ }

    console.log('🔙 Status:', response.status);
    console.log('🔙 Body  :', raw);

    if (response.ok && data && data.status === 'success') {
      console.log('✅ UC u dërgua me sukses');
      return {
        statusCode: 200,
        body: JSON.stringify({ ok: true, message: 'UC u dërgua me sukses', data })
      };
    }

    console.warn('⚠️  Dërgimi dështoi');
    return {
      statusCode: 400,
      body: JSON.stringify({ ok: false, message: 'Dërgimi dështoi', data })
    };
  } catch (err) {
    console.error('❌ Fetch failed:', err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message || 'fetch failed' })
    };
  }
};
