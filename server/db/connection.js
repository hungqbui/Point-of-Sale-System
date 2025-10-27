<<<<<<< HEAD
import mysql from 'mysql2/promise'
=======
import mysql from 'mysql2'
>>>>>>> DiegoDominguez
import { loadEnv } from '../loadEnv.js';

loadEnv();

<<<<<<< HEAD
export const db = await mysql.createConnection({
=======
export const db = mysql.createConnection({
>>>>>>> DiegoDominguez
    host: process.env.URL || 'localhost',
    user: process.env.USER || 'root',
    password: process.env.PASSWORD || 'admin',
    port: process.env.PORT || '3306',
    database: process.env.DATABASE || 'pos',
    ssl: {
        rejectUnauthorized: false
    }
});

<<<<<<< HEAD
console.log('Connected to the database.');
=======
db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database.');


});
>>>>>>> DiegoDominguez
