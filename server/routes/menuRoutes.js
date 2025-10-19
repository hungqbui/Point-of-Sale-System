// routes/menuRoutes.js
export function handleMenuRoutes(req, res) {
    const { url, method } = req;
  
    // Only handle /api/menuItems POST
    if (url === '/api/menuItems' && method === 'POST') {
      let body = '';
  
      req.on('data', chunk => {
        body += chunk.toString();
      });
  
      req.on('end', () => {
        try {
          const newItem = JSON.parse(body);
          console.log('📦 New menu item received:', newItem);
  
          // You can later push to DB or array
          res.statusCode = 201;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ message: 'Menu item added successfully', item: newItem }));
        } catch (err) {
          console.error('Error parsing JSON:', err);
          res.statusCode = 400;
          res.end(JSON.stringify({ error: 'Invalid JSON format' }));
        }
      });
  
      return true; // ✅ route handled
    }
  
    return false; // Not handled, continue to index.js routes
  }
  