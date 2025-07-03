/* eslint-disable */
exports.handler = async (event) => {
  try {
    const session = JSON.parse(event.body);   // vjen nga webhook
    console.log('🚚 Auto-deliver UC for', session.id);

    // 👉  Lidhje me API ose Google Sheets
    // const res = await fetch('https://api.u7buy.com/...');

    return { statusCode: 200, body: 'UC sent' };
  } catch (err) {
    console.error('❌ Finalize error:', err);
    return { statusCode: 500, body: 'Finalize failed' };
  }
};
