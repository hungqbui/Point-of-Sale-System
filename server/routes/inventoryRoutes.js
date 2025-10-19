// server/routes/inventoryRoutes.js

// Temporary in-memory storage (resets when server restarts)
let inventoryOrders = [
  
  
];

// --- Function to handle all /api/inventory routes ---
export function handleInventoryRoutes(req, res) {
  const { url, method } = req;

  // ✅ GET all inventory orders
  if (method === 'GET' && url === '/api/inventory') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(inventoryOrders));
    return true;
  }

  // ✅ POST a new inventory order
  if (method === 'POST' && url === '/api/inventory') {
    let body = '';

    req.on('data', chunk => {
      body += chunk;
    });

    req.on('end', () => {
      try {
        const newOrder = JSON.parse(body);
        newOrder.id = inventoryOrders.length + 1;

        inventoryOrders.push(newOrder);
        console.log('📦 New inventory order received:', newOrder);

        res.statusCode = 201;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ message: 'Inventory order added successfully', order: newOrder }));
      } catch (err) {
        console.error('❌ Error handling /api/inventory POST:', err);
        res.statusCode = 400;
        res.end(JSON.stringify({ error: 'Invalid JSON data' }));
      }
    });

    return true;
  }

  return false; // not handled
}
