// netlify/functions/startDelivery.js
exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Only POST requests allowed' })
    };
  }

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

  const API_KEY = process.env.U7BUY_API_KEY;
  if (!API_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'U7BUY_API_KEY mungon në env vars' })
    };
  }

  try {
    const response = await fetch('https://open-api.u7buy.com/open-api/order/start_delivery', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ productId, playerId, serverId })
    });

    const data = await response.json().catch(() => null);

    if (response.ok && data && data.code === 200) {
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
