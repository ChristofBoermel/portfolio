import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Pool } from 'pg';
import nodemailer from 'nodemailer';
import { seed } from './seed.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Database Connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

app.get('/api/health', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json({ status: 'ok', time: result.rows[0].now });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Database connection failed' });
    }
});

app.get('/api/profile', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM profile LIMIT 1');
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
});

app.get('/api/resume', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM resume ORDER BY ordering ASC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch resume' });
    }
});

app.get('/api/services', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM services');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch services' });
    }
});

app.get('/api/portfolio', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM portfolio');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch portfolio' });
    }
});

try {
    // DB Insert (Parameterized query prevents SQL Injection)
    await pool.query(
        'INSERT INTO contact_messages (name, email, subject, message) VALUES ($1, $2, $3, $4)',
        [name, email, subject, message]
    );

    // NOTE: Email sending removed due to Render SMTP blocking.
    // We will handle email sending on the frontend via EmailJS.

    res.json({ status: 'success', message: 'Message saved successfully' });
} catch (err: any) {
    console.error('Database Error:', err);
    res.status(500).json({ error: 'Failed to save message' });
}
});

app.get('/api/test-email', async (req, res) => {
    try {
        console.log('Testing SMTP Connection...');
        await transporter.verify();
        console.log('SMTP Connection Success');
        res.json({
            status: 'success',
            message: 'Server is ready to take our messages',
            config: {
                host: 'smtp.gmail.com',
                port: 587,
                secure: false,
                user: process.env.SMTP_USER ? 'Set' : 'Missing',
            }
        });
    } catch (err: any) {
        console.error('SMTP Connection Failed:', err);
        res.status(500).json({
            status: 'error',
            message: 'SMTP Connection Failed',
            error: err.message,
            code: err.code,
            command: err.command,
            config: {
                host: 'smtp.gmail.com',
                port: 587,
                secure: false,
            }
        });
    }
});

app.post('/api/seed', async (req, res) => {
    try {
        await seed();
        res.json({ status: 'success', message: 'Database seeded successfully' });
    } catch (err: any) {
        console.error('Seed failed:', err);
        res.status(500).json({ error: 'Failed to seed database', details: err.message });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
