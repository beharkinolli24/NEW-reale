
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const fetch = require('node-fetch');

exports.handler = async (event) => {
  try {
    const { sessionId } = JSON.parse(event.body);

    if (!sessionId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, error: "Session ID mungon" }),
      };
    }

    // Merr checkout session nga Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    const playerId = session.metadata.playerId;
    const serverId = session.metadata.serverId;
    const productId = session.metadata.productId;

    if (!playerId || !serverId || !productId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, error: "Të dhënat janë të paplota" }),
      };
    }

    // Thirr API-në e U7BUY për të dërguar UC
    const u7buyResponse = await fetch("https://api.u7buy.com/open-api/order/start_delivery", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Basic dTdidXk4MGQ0ZDRmMjM1MTIzMjc1OmVPd2RuVllsR29TQTFGTjNBaURIMkZMdVVPNlpuQ1R5ZVNsc1NIc3o"
      },
      body: JSON.stringify({
        productId,
        buyer: playerId,
        buyerRegion: serverId
      })
    });

    const u7buyResult = await u7buyResponse.json();

    if (u7buyResult.code === 200) {
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true, message: "UC u dërgua me sukses" }),
      };
    } else {
      return {
        statusCode: 500,
        body: JSON.stringify({ success: false, error: "Gabim nga U7BUY", details: u7buyResult }),
      };
    }

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: err.message }),
    };
  }
};
