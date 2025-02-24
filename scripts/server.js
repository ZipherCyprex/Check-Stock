require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// เชื่อมต่อ Neon Database
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

// API รับข้อมูลจาก Checkout แล้วบันทึกลง DB
app.post('/save-order', async (req, res) => {
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
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
