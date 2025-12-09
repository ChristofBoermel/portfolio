import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Pool } from 'pg';
dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});
app.get('/api/health', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json({ status: 'ok', time: result.rows[0].now });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Database connection failed' });
    }
});
app.get('/api/profile', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM profile LIMIT 1');
        res.json(result.rows[0]);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
});
app.get('/api/resume', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM resume ORDER BY ordering ASC');
        res.json(result.rows);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch resume' });
    }
});
app.get('/api/services', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM services');
        res.json(result.rows);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch services' });
    }
});
app.get('/api/portfolio', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM portfolio');
        res.json(result.rows);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch portfolio' });
    }
});
app.post('/api/contact', async (req, res) => {
    const { name, email, subject, message } = req.body;
    try {
        await pool.query('INSERT INTO contact_messages (name, email, subject, message) VALUES ($1, $2, $3, $4)', [name, email, subject, message]);
        res.json({ status: 'success', message: 'Message sent' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to send message' });
    }
});
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
