// Import the built-in 'http' module
import http from 'http';

// ✅ Moe New imports for modular routing
import { handleMenuRoutes } from './routes/menuRoutes.js';       // ✅ Moe NEW1: Added to handle /api/menuItems routes
import { handleUtilityRoutes } from './routes/utilityRoutes.js'; // ✅ Moe NEW2: Added to handle utility-related routes
import { handleInventoryRoutes } from './routes/inventoryRoutes.js'; // ✅ Moe NEW3: Added to handle inventory routes

// ✅ Updated to allow connections from any host (previously 'localhost')
const hostname = '0.0.0.0'; // ✅ Updated hostname
const port = 3000;

// --- Create HTTP Server ---
const server = http.createServer((req, res) => {
  const { url, method } = req;
  console.log(`${method} request for ${url}`);

  // ✅ Added full CORS support
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173'); // 🆕 Moe Allow frontend requests
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');   // 🆕 Moe Allow specific HTTP methods
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');         // 🆕 Moe Allow JSON headers

  // ✅ Added preflight (OPTIONS) handling
  if (method === 'OPTIONS') {           // 🆕 Moe Handle CORS preflight requests
    res.statusCode = 204;               // 🆕 Moe Respond with No Content
    res.end();
    return;                             // 🆕 Moe Stop further request handling
  }

  // ✅ Delegate requests to new route handlers
  if (handleMenuRoutes(req, res)) return;       // 🆕 Moe Handle /api/menuItems
  if (handleUtilityRoutes(req, res)) return;    // 🆕 Moe Handle utility-related routes
  const inventoryHandled = handleInventoryRoutes(req, res); // 🆕 Handle inventory routes
  if (inventoryHandled) return;                 // 🆕 Moe Exit if inventory handled

  // ✅ (Duplicate but new in structure) Another menu route check
  const handled = handleMenuRoutes(req, res); // 🆕  Moe Delegate menu routes again (redundant)
  if (handled) return;                        // 🆕 Moe Exit if already handled

  // --- Default API routes (same as before) ---
  if (method === 'GET' && url === '/api') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end('<h1>Welcome to the Homepage!</h1><p>This is a plain Node.js server.</p>');
  } 
  else if (method === 'GET' && url === '/api/menuItems') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(menuItems));
  } 
  else {
    // --- 404 handler (unchanged) ---
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/html');
    res.end('<h1>404 - Page Not Found</h1><p>The requested URL was not found on this server.</p>');
  }
});

// --- ✅ Start Server ---
server.listen(port, hostname, () => {
  console.log(`✅ Server running at http://${hostname}:${port}/`); // 🆕  Moe Added emoji for clarity
  console.log('Press Ctrl+C to stop the server.');                 // 🆕  Moe Additional log message
});
