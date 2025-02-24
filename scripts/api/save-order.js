const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { fullName, phone, houseNumber, street, village, district, amphoe, province, zipcode } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO orders (full_name, phone, house_number, street, village, district, amphoe, province, zipcode)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
            [fullName, phone, houseNumber, street, village, district, amphoe, province, zipcode]
        );

        res.json({ success: true, order: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err.message });
    }
}
