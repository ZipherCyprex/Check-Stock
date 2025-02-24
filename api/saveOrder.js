import { Pool } from 'pg';
import fs from 'fs';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
        // เพิ่ม SSL options สำหรับ Neon DB
        ca: process.env.NODE_ENV === 'production' ? fs.readFileSync('/path/to/ssl-cert.pem').toString() : null
    }
});
export default async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST');

    if (req.method === 'OPTIONS') return res.status(200).end();

    if (req.method !== 'POST') return res.status(405).end();

    try {
        const client = await pool.connect();
        await client.query(`
      INSERT INTO orders (
        product_id, quantity, full_name, phone, house_number,
        street, village, district, amphoe, province, zipcode,
        wifi_name, wifi_password
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
    `, [
            req.body.productId,
            req.body.quantity,
            req.body.fullName,
            req.body.phone,
            req.body.houseNumber,
            req.body.street,
            req.body.village,
            req.body.district,
            req.body.amphoe,
            req.body.province,
            req.body.zipcode,
            req.body.wifiName,
            req.body.wifiPassword
        ]);
        client.release();
        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Database Error:', error);
        res.status(500).json({ error: error.message });
    }
};