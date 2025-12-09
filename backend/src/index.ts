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

import nodemailer from 'nodemailer';

// Email Transporter Configuration (Gmail)
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS?.replace(/\s+/g, ''),
    },
});

app.post('/api/contact', async (req, res) => {
    const { name, email, subject, message } = req.body;

    // Validation
    const errors: string[] = [];

    // Name: No numbers, only letters and spaces
    if (!/^[a-zA-Z\s]+$/.test(name)) {
        errors.push('Name must contain only letters and spaces.');
    }

    // Email: Basic validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.push('Invalid email address.');
    }

    // Non-empty fields
    if (!subject || subject.trim().length === 0) {
        errors.push('Subject cannot be empty.');
    }
    if (!message || message.trim().length === 0) {
        errors.push('Message cannot be empty.');
    }

    if (errors.length > 0) {
        res.status(400).json({ error: errors.join(' ') });
        return;
    }

    try {
        // DB Insert (Parameterized query prevents SQL Injection)
        await pool.query(
            'INSERT INTO contact_messages (name, email, subject, message) VALUES ($1, $2, $3, $4)',
            [name, email, subject, message]
        );

        // Send Email
        const info = await transporter.sendMail({
            from: `"${name}" <${email}>`, // sender address
            to: process.env.SMTP_USER, // list of receivers (send to self)
            subject: `Portfolio Contact: ${subject}`, // Subject line
            text: `Message from: ${name} (${email})\n\n${message}`, // plain text body
            html: `<p><strong>From:</strong> ${name} (${email})</p><p><strong>Message:</strong></p><p>${message}</p>`, // html body
        });

        console.log("Message sent: %s", info.messageId);

        res.json({ status: 'success', message: 'Message sent successfully' });
    } catch (err: any) {
        console.error('Error sending email:', err);
        if (err.code) console.error('Error Code:', err.code);
        if (err.command) console.error('Failed Command:', err.command);
        if (err.response) console.error('SMTP Response:', err.response);

        // Debug Config (don't log full password)
        console.log('SMTP Config:', {
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: process.env.SMTP_SECURE,
            user: process.env.SMTP_USER,
            passLength: process.env.SMTP_PASS ? process.env.SMTP_PASS.length : 0
        });

        res.status(500).json({ error: 'Failed to send message' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
