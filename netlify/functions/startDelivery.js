const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Only POST requests allowed' }),
    };
  }

  const { productId, playerId, serverId } = JSON.parse(event.body);

  const API_KEY = 'ivGuB4iP0FKkl6U3lbZYLFxRYJiGd0mnaXI7rgLi'; // API yt U7BUY

  try {
    const response = await fetch('https://api.u7buy.com/order/start_delivery', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        productId,
        playerId,
        serverId,
      }),
    });

    const data = await response.json();

    if (data.status === 'success') {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: '✅ UC u dërgua me sukses!', data }),
      };
    } else {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: '❌ Dështoi dërgimi', error: data }),
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: '❌ Gabim në server', error: error.message }),
    };
  }
};
