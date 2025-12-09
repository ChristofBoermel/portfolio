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
        birthdate DATE,
        social_links JSONB
      );
    `);

    // Create Resume Table
    await pool.query(`
      CREATE TABLE resume (
        id SERIAL PRIMARY KEY,
        category VARCHAR(50) NOT NULL, -- 'summary', 'education', 'experience', 'certificate'
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
      INSERT INTO profile (name, title, bio, email, phone, location, birthdate, social_links)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `, [
      'Christof Börmel',
      'I am a passionate developer building modern Fullstack applications.',
      'My name is Christof, I am a {age} year old junior Fullstack developer from Hamburg. I am a sports enthusiast, like gaming and travelling the world. My goal is it to showcase some of my skills and projects. I hope to hear from you soon.',
      'christofboermel@gmail.com',
      '+49 176 56123820',
      'Hamburg, Germany',
      '2002-01-02',
      JSON.stringify({ twitter: '#', facebook: '#', instagram: '#', linkedin: '#' })
    ]);

    // Insert Resume Data

    // Education
    await pool.query(`
      INSERT INTO resume (category, title, subtitle, date_range, description, ordering)
      VALUES ($1, $2, $3, $4, $5, $6)
    `, ['education', 'Vocational School ITECH Wilhelmsburg', 'Applied Apprenticeship in Applied Computer Science', '2022 - 2025', 'Finished my applied apprenticeship.', 1]);

    await pool.query(`
      INSERT INTO resume (category, title, subtitle, date_range, description, ordering)
      VALUES ($1, $2, $3, $4, $5, $6)
    `, ['education', 'Nordakademie', 'Applied Computer Science', '2020 - 2022', 'Studied Applied Computer Science.', 2]);

    await pool.query(`
      INSERT INTO resume (category, title, subtitle, date_range, description, ordering)
      VALUES ($1, $2, $3, $4, $5, $6)
    `, ['education', 'Gymnasium Meiendorf', 'High School', '2012 - 2020', null, 3]);

    // Experience
    await pool.query(`
      INSERT INTO resume (category, title, subtitle, date_range, list_items, ordering)
      VALUES ($1, $2, $3, $4, $5, $6)
    `, ['experience', 'Software Developer', 'CP Corporate Planning GmbH', '2020 - 2025', JSON.stringify([
      'Development of frontend and backend components for web applications',
      'Implementation of modern user interfaces using common JavaScript frameworks',
      'Integration of databases as well as design and optimization of database structures',
      'Development, extension and maintenance of RESTful APIs and web services',
      'Analysis and improvement of application performance and stability',
      'Conducting regular code reviews and applying quality assurance measures',
      'Testing and debugging applications to ensure functionality',
      'Maintenance and further development of existing software solutions and systems',
      'Development of automated build and deployment processes, especially using Azure and Git technologies',
      'Creation of technical documentation',
      'Leading a small team during my final project'
    ]), 1]);

    // Certificates
    await pool.query(`
      INSERT INTO resume (category, title, subtitle, date_range, description, ordering)
      VALUES ($1, $2, $3, $4, $5, $6)
    `, ['certificate', 'Microsoft Azure Fundamentals (AZ-900)', 'Microsoft', '2025', null, 1]);

    await pool.query(`
      INSERT INTO resume (category, title, subtitle, date_range, description, ordering)
      VALUES ($1, $2, $3, $4, $5, $6)
    `, ['certificate', 'Exin Agile Scrum Foundation', 'Exin', '2025', null, 2]);

    await pool.query(`
      INSERT INTO resume (category, title, subtitle, date_range, description, ordering)
      VALUES ($1, $2, $3, $4, $5, $6)
    `, ['certificate', 'Exin Agile Product Owner', 'Exin', '2025', null, 3]);


    // Insert Services
    const services = [
      { title: 'Web Development', icon: 'code', desc: 'Building responsive and performant websites.' },
      { title: 'Backend Design', icon: 'server', desc: 'Designing scalable APIs and database schemas.' },
      { title: 'Cloud Deployment', icon: 'cloud', desc: 'Deploying applications to Azure and other cloud providers.' },
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
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
};

seed();
