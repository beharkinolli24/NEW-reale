const fetch = require('node-fetch');

async function getOfferDetails(offerId = '1938299181721538561') {
  const url = `https://openapi.u7buy.com/open-api/digital_product_offer/${offerId}`;

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Basic wmSzT3ErP6e7jYlOOGjkS1qXKDHIsWKAzRSTG49F'
      }
    });

    const data = await res.json();
    console.log('✅ Oferta:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('❌ Gabim gjatë marrjes së ofertës:', err.message);
  }
}

// Thirr funksionin për test
getOfferDetails();
// ose getOfferDetails('SPU_ID TJETËR');
