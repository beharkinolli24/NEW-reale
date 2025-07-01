export async function handler(event) {
  try {
    const { productId, playerId, serverId } = JSON.parse(event.body);

    const response = await fetch("https://api.u7buy.com/order/placeOrder", {
      method: "POST",
      headers: {
        "Authorization": "Bearer ivGuB4iP0FKkl6U3lbZYLFxRYJiGd0mnaXI7rgLi",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        productId,
        buyer: {
          account: playerId,
          server: serverId
        },
        quantity: 1
      })
    });

    const data = await response.json();
    return {
      statusCode: response.status,
      body: JSON.stringify(data)
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
}
