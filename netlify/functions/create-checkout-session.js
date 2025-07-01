const stripe = require("stripe")("jMJieA1nIRMPXycSlbzQ3ModA5fohRnqa14NGLS0");
;
const YOUR_DOMAIN = "https://trustucshop.com";

exports.handler = async (event) => {
  const { ucProductId, playerId, serverId } = JSON.parse(event.body);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "eur",
          product_data: {
            name: `PUBG UC – Player ID: ${playerId}`,
          },
          unit_amount: getAmount(ucProductId),
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${YOUR_DOMAIN}/success.html?product=${ucProductId}&player=${playerId}&server=${serverId}`,
    cancel_url:  `${YOUR_DOMAIN}/cancel.html`,
  });

  return {
    statusCode: 200,
    body: JSON.stringify({ url: session.url }),
  };
};

function getAmount(id) {
  const prices = {
    "1938299181721538561": 55,
    "1938300815303401474": 420,
    "1931436511665717249": 810,
    "1938550489652588546": 2100,
  };
  return prices[id];
}
