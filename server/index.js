// Import the built-in 'http' module
import http from 'http';

// ✅ Moe New imports for modular routing
import { handleMenuRoutes } from './routes/menuRoutes.js';       // ✅ Moe NEW1: Added to handle /api/menuItems routes
import { handleUtilityRoutes } from './routes/utilityRoutes.js'; // ✅ Moe NEW2: Added to handle utility-related routes
import { handleInventoryRoutes } from './routes/inventoryRoutes.js'; // ✅ Moe NEW3: Added to handle inventory routes

// ✅ Updated to allow connections from any host (previously 'localhost')
const hostname = '0.0.0.0'; // ✅ Updated hostname
const port = 3000;

// --- Sample Data (unchanged) ---
const menuItems = [
  { id: 1, name: '#1 Combo', price: 10.00, image: 'https://placehold.co/200x150/d3a47c/ffffff?text=Sandwich+1' },
  { id: 2, name: '#2 Combo', price: 10.50, image: 'https://placehold.co/200x150/bca28e/ffffff?text=Sandwich+2' },
  { id: 3, name: '#3 Combo', price: 9.50, image: 'https://placehold.co/200x150/e9c898/ffffff?text=Grilled+Cheese' },
  { id: 4, name: '#4 Combo', price: 11.00, image: 'https://placehold.co/200x150/c5a78c/ffffff?text=Baguette' },
  { id: 5, name: '#5 Combo', price: 12.00, image: 'https://placehold.co/200x150/d3b59f/ffffff?text=Sub' },
  { id: 6, name: '#6 Combo', price: 9.75, image: 'https://placehold.co/200x150/c8d0b5/ffffff?text=Wrap' },
  { id: 7, name: 'Grab & Go', count: 10, color: '#16a34a' },
  { id: 8, name: 'Discounts', icon: '%', color: '#16a34a' },
  { id: 9, name: 'Sides', icon: 'sides', color: '#f97316' },
  { id: 10, name: 'Custom amount', icon: 'custom', color: '#f5f5f5' }
];

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
