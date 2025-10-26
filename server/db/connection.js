import mysql from 'mysql2';
import { loadEnv } from '../loadEnv.js';

loadEnv();

const {
    DB_HOST,
    DB_USER,
    DB_PASSWORD,
    DB_PORT,
    DB_NAME,
    URL,
    USER,
    PASSWORD,
    PORT,
    DATABASE
} = process.env;

export const db = mysql.createConnection({
    host: DB_HOST || URL || 'localhost',
    user: DB_USER || USER || 'root',
    password: DB_PASSWORD || PASSWORD || 'admin',
    port: Number(DB_PORT || PORT || 3306),
    database: DB_NAME || DATABASE || 'pos',
    ssl: {
        rejectUnauthorized: false
    }
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database.');
    db.query('SELECT DATABASE() AS db', (queryErr, results) => {
        if (queryErr) {
            console.error('Unable to determine current database:', queryErr);
            return;
        }
        const currentDb = results?.[0]?.db ?? 'unknown';
        console.log(`Using database: ${currentDb}`);
    });
});
