// Import the built-in 'http' module
import http from 'http';

const hostname = '0.0.0.0';
const port = 3000;
const menuItems = [{ id: 1, name: '#1 Combo', price: 10.00, image: 'https://placehold.co/200x150/d3a47c/ffffff?text=Sandwich+1' },
{ id: 2, name: '#2 Combo', price: 10.50, image: 'https://placehold.co/200x150/bca28e/ffffff?text=Sandwich+2' },
{ id: 3, name: '#3 Combo', price: 9.50, image: 'https://placehold.co/200x150/e9c898/ffffff?text=Grilled+Cheese' },
{ id: 4, name: '#4 Combo', price: 11.00, image: 'https://placehold.co/200x150/c5a78c/ffffff?text=Baguette' },
{ id: 5, name: '#5 Combo', price: 12.00, image: 'https://placehold.co/200x150/d3b59f/ffffff?text=Sub' },
{ id: 6, name: '#6 Combo', price: 9.75, image: 'https://placehold.co/200x150/c8d0b5/ffffff?text=Wrap' },
{ id: 7, name: 'Grab & Go', count: 10, color: '#16a34a' },
{ id: 8, name: 'Discounts', icon: '%', color: '#16a34a' },
{ id: 9, name: 'Sides', icon: 'sides', color: '#f97316' },
{ id: 10, name: 'Custom amount', icon: 'custom', color: '#f5f5f5' }]
const server = http.createServer((req, res) => {
    const { url, method } = req;
    console.log(`${method} request for ${url}`);
    // Handle GET request to the root URL "/"
    if (method === 'GET' && url === '/api') {
        // Set the HTTP status code to 200 (OK)
        res.statusCode = 200;
        // Set the Content-Type header to let the client know we're sending HTML
        res.setHeader('Content-Type', 'text/html');
        // End the response, sending the content back to the client
        res.end('<h1>Welcome to the Homepage!</h1><p>This is a plain Node.js server.</p>');
    } else if (method === 'GET' && url === '/api/menuItems') {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(menuItems));
    }
    // --- 404 Not Found Handler ---
    // If no other routes match, send a 404 response.
    else {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/html');
        res.end('<h1>404 - Page Not Found</h1><p>The requested URL was not found on this server.</p>');
    }
});

// Start the server and have it listen on the specified port and hostname.
// The callback function is executed once the server starts listening.
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
    console.log('Press Ctrl+C to stop the server.');
});
