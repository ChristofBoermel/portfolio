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

// Email Transporter Configuration (Gmail)
const transporter = nodemailer.createTransport({
    service: 'gmail', // Built-in transport for Gmail (automatically sets host/port/secure)
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS?.replace(/\s+/g, ''),
    },
    logger: true, // Log to console
    debug: true,  // Include debug info
    // Force IPv4 to prevent IPv6 connectivity issues in some cloud environments
    family: 4,
    // Fail fast if connection hangs
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
});

app.post('/api/contact', async (req, res) => {
    const { name, email, subject, message } = req.body;

    // Validation
    const errors: string[] = [];

    // Name: Basic check
    if (!name || name.trim().length === 0) {
        errors.push('Name cannot be empty.');
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
            from: `"${name}" <${process.env.SMTP_USER}>`, // sender address (must be authenticated user)
            replyTo: email, // reply to the visitor
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

app.get('/api/test-email', async (req, res) => {
    try {
        console.log('Testing SMTP Connection...');
        await transporter.verify();
        console.log('SMTP Connection Success');
        res.json({
            status: 'success',
            message: 'Server is ready to take our messages',
            config: {
                host: process.env.SMTP_HOST || 'default (smtp.gmail.com)',
                port: process.env.SMTP_PORT || 'default (587)',
                secure: process.env.SMTP_SECURE || 'default (false)',
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
                host: process.env.SMTP_HOST || 'default (smtp.gmail.com)',
                port: process.env.SMTP_PORT || 'default (587)',
                secure: process.env.SMTP_SECURE || 'default (false)',
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
