const fetch = require("node-fetch");
exports.handler = async (event) => {
  const { productId, playerId, serverId } = JSON.parse(event.body);
  const response = await fetch("https://api.u7buy.com/order/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": "ivGuB4iP0FKkl6U3lbZYLFxRYJiGd0mnaXI7rgLi",
    },
    body: JSON.stringify({
      productId,
      buyerGameRoleId: playerId,
      buyerServerId: serverId,
    }),
  });
  const data = await response.json();
  return { statusCode: 200, body: JSON.stringify(data) };
};
