// netlify/functions/saveOrder.js
exports.handler = async (event, context) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json"
  };

  // respond to preflight
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ success: false, message: "Method not allowed" })
    };
  }

  try {
    const order = JSON.parse(event.body || "{}");

    // basic validation
    if (!order || !order.customer || !Array.isArray(order.cart)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ success: false, message: "Invalid order payload" })
      };
    }

    // create order id
    const orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 9000 + 1000)}`;

    // Log order server-side (visible in Netlify function logs)
    console.log("=== NEW ORDER RECEIVED ===");
    console.log("orderId:", orderId);
    console.log(JSON.stringify(order, null, 2));
    console.log("==========================");

    // respond success
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, orderId, message: "Order received and logged." })
    };
  } catch (err) {
    console.error("saveOrder error:", err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, message: "Server error" })
    };
  }
};