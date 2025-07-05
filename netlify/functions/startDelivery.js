// netlify/functions/startDelivery.js
exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Only POST allowed' };
  }

  let parsed;
  try {
    parsed = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: 'Body must be valid JSON' };
  }

  const { productId, playerId, serverId } = parsed;
  if (!productId || !playerId || !serverId) {
    return { statusCode: 400, body: 'productId, playerId, serverId required' };
  }

  /*  --- TOKENI YT ---  */
  const BASIC_TOKEN = 'dTdidXk4MGQ0ZDRmMjM1MTIzMjc1OndtU3pUM0VyUDZlN2pZbE9PR2prUzFxWEtESElzV0tBelJTVEc0OUY=';

  try {
    const response = await fetch(
      'https://openapi.u7buy.com/prod-api/order/start_delivery',
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${BASIC_TOKEN}`,
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          bo: { productId, playerId, serverId }
        })
      }
    );

    const raw = await response.text();
    let data = null;
    try { data = JSON.parse(raw); } catch {}

    if (response.ok && data && data.code === 200) {
      return {
        statusCode: 200,
        body: JSON.stringify({ ok: true, data })
      };
    }

    return {
      statusCode: response.status,
      body: JSON.stringify({ ok: false, raw })
    };
  } catch (err) {
    return { statusCode: 500, body: err.message };
  }
};
