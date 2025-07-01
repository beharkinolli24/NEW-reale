const fetch = require("node-fetch");

exports.handler = async (event) => {
  try {
    // Parse body
    const { productId, playerId, serverId } = JSON.parse(event.body);
    console.log("send-uc invoked with:", { productId, playerId, serverId });

    // Thirr API-në e U7BUY për të krijuar porosinë
    const response = await fetch("https://api.u7buy.com/order/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Hard‑coduar për momentin; më vonë mund ta zhvendosësh në Environment Variable
        "api-key": "ivGuB4iP0FKkl6U3lbZYLFxRYJiGd0mnaXI7rgLi",
      },
      body: JSON.stringify({
        productId,
        buyerGameRoleId: playerId,
        buyerServerId: serverId,
      }),
    });

    const data = await response.json();
    console.log("U7BUY response:", data);

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };

  } catch (err) {
    console.error("Error in send-uc:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
};
