import { findCustomerByEmail, createNewCustomer } from "../model/Customer.js";

export const handleAuth = (req, res) => {
    const { method, url } = req;
    if (method === 'POST' && url === '/api/auth/customer-login') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', async () => {
            const { email, password } = JSON.parse(body);

            const customer = await findCustomerByEmail(email);
            if (!customer) {
                res.statusCode = 401;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Invalid email or password' }));
                return;
            }

            const isPasswordValid = await customer.validatePassword(password);
            if (!isPasswordValid) {
                res.statusCode = 401;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Invalid email or password' }));
                return;
            }
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ message: 'Login successful', customerID: customer.customerID }));
        });
    } else if (method === 'POST' && url === '/api/auth/customer-register') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', async () => {
            const { firstName: fname, lastName: lname, phone : phoneNumber, email, password } = JSON.parse(body);


            const customer = await findCustomerByEmail(email);
            if (customer) {
                res.statusCode = 401;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Email already exist, please login' }));
                return;
            }
            try {
                const newCustomer = await createNewCustomer({ fname, lname, phoneNumber, email, password });
    
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ message: 'Registration successful', customerID: newCustomer.customerID }));
            } catch (error) {
                console.error('Error creating customer:', error);
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'DB Error', details: error.message }));
            }
        });
    } else if (method === 'POST' && url === '/api/auth/employee-login') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {

        });
    } else {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: "Not Found" }));
    }
};