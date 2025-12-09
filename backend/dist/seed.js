import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});
const seed = async () => {
    try {
        console.log('Seeding database...');
        // Drop tables if they exist
        await pool.query(`DROP TABLE IF EXISTS profile CASCADE`);
        await pool.query(`DROP TABLE IF EXISTS resume CASCADE`);
        await pool.query(`DROP TABLE IF EXISTS services CASCADE`);
        await pool.query(`DROP TABLE IF EXISTS portfolio CASCADE`);
        await pool.query(`DROP TABLE IF EXISTS contact_messages CASCADE`);
        // Create Profile Table
        await pool.query(`
      CREATE TABLE profile (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        title VARCHAR(255),
        bio TEXT,
        email VARCHAR(255),
        phone VARCHAR(50),
        location VARCHAR(255),
        social_links JSONB
      );
    `);
        // Create Resume Table
        await pool.query(`
      CREATE TABLE resume (
        id SERIAL PRIMARY KEY,
        category VARCHAR(50) NOT NULL, -- 'summary', 'education', 'experience'
        title VARCHAR(255) NOT NULL,
        subtitle VARCHAR(255),
        date_range VARCHAR(100),
        description TEXT,
        list_items JSONB, -- Array of strings for bullet points
        ordering INT
      );
    `);
        // Create Services Table
        await pool.query(`
      CREATE TABLE services (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        icon VARCHAR(100)
      );
    `);
        // Create Portfolio Table
        await pool.query(`
      CREATE TABLE portfolio (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        category VARCHAR(50),
        image_url TEXT,
        description TEXT
      );
    `);
        // Create Contact Messages Table
        await pool.query(`
      CREATE TABLE contact_messages (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        email VARCHAR(255),
        subject VARCHAR(255),
        message TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
        console.log('Tables created.');
        // Insert Profile Data
        await pool.query(`
      INSERT INTO profile (name, title, bio, email, phone, location, social_links)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `, [
            'Christof Börmel',
            'Professional Developer & Tech Enthusiast',
            'I am a passionate developer building modern web applications. Specialized in React, Node.js, and Cloud technologies.',
            'christof@example.com', // Placeholder
            '+49 123 456 789', // Placeholder
            'Germany', // Placeholder
            JSON.stringify({ twitter: '#', facebook: '#', instagram: '#', linkedin: '#' })
        ]);
        // Insert Resume Data
        // Summary
        await pool.query(`
      INSERT INTO resume (category, title, subtitle, description, list_items, ordering)
      VALUES ($1, $2, $3, $4, $5, $6)
    `, ['summary', 'Christof Börmel', null, 'Innovative developer with a passion for clean code and scalable architectures.', null, 1]);
        // Education
        await pool.query(`
      INSERT INTO resume (category, title, subtitle, date_range, description, ordering)
      VALUES ($1, $2, $3, $4, $5, $6)
    `, ['education', 'Master of Computer Science', 'Technical University', '2018 - 2020', '专注于 Advanced Algorithms and Distributed Systems.', 1]);
        // Experience
        await pool.query(`
      INSERT INTO resume (category, title, subtitle, date_range, list_items, ordering)
      VALUES ($1, $2, $3, $4, $5, $6)
    `, ['experience', 'Senior Software Engineer', 'Tech Corp', '2021 - Present', JSON.stringify([
                'Lead backend development for high-traffic web apps.',
                'Mentored junior developers and established code quality standards.',
                'Implemented CI/CD pipelines using Docker and Kubernetes.'
            ]), 1]);
        // Insert Services
        const services = [
            { title: 'Web Development', icon: 'code', desc: 'Building responsive and performant websites.' },
            { title: 'Backend Design', icon: 'server', desc: 'Designing scalable APIs and database schemas.' },
            { title: 'Cloud Deployment', icon: 'cloud', desc: 'Deploying applications to AWS/Azure/GCP.' },
        ];
        for (const s of services) {
            await pool.query('INSERT INTO services (title, icon, description) VALUES ($1, $2, $3)', [s.title, s.icon, s.desc]);
        }
        // Insert Portfolio items
        const portfolio = [
            { title: 'E-commerce Platform', category: 'Web', image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
            { title: 'Finance Dashboard', category: 'App', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
        ];
        for (const p of portfolio) {
            await pool.query('INSERT INTO portfolio (title, category, image_url) VALUES ($1, $2, $3)', [p.title, p.category, p.image]);
        }
        console.log('Seeding completed successfully.');
        process.exit(0);
    }
    catch (err) {
        console.error('Error seeding database:', err);
        process.exit(1);
    }
};
seed();
