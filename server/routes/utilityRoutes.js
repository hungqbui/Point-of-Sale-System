// routes/utilityRoutes.js
// Plain Node.js handler for /api/utilities (GET + POST) using in-memory data (no DB)

let utilityPayments = []; // in-memory store

export function handleUtilityRoutes(req, res) {
  const { url, method } = req;

  // GET /api/utilities  -> return all utility payments
  if (url === '/api/utilities' && method === 'GET') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(utilityPayments));
    return true;
  }

  // POST /api/utilities -> add a new utility payment
  if (url === '/api/utilities' && method === 'POST') {
    let body = '';

    req.on('data', chunk => (body += chunk.toString()));
    req.on('end', () => {
      try {
        const incoming = JSON.parse(body);

        // Minimal shape (you can adjust later)
        // { paymentId, type: 'water'|'electricity'|'gas', totalAmount, date }
        const record = {
          id: utilityPayments.length + 1,
          paymentId: incoming.paymentId ?? `P-${Date.now()}`,
          type: incoming.type ?? 'unknown',
          totalAmount: Number(incoming.totalAmount ?? 0),
          date: incoming.date ?? new Date().toISOString().slice(0, 10),
        };

        utilityPayments.push(record);

        console.log('💡 New utility payment received:', record);

        res.statusCode = 201;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ message: 'Utility payment saved', record }));
      } catch (e) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Invalid JSON data' }));
      }
    });

    return true;
  }

  // Not handled here
  return false;
}
