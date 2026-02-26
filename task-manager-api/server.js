require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const db = require('./db');

const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Initialize Database using init.sql
async function initializeDB() {
    try {
        const initSql = fs.readFileSync(path.join(__dirname, 'init.sql'), 'utf-8');
        await db.query(initSql);
        console.log('Database tables verified/created successfully.');
    } catch (err) {
        console.error('Error initializing database:', err);
    }
}

initializeDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Base route
app.get('/', (req, res) => {
    res.send('Task Manager API is running.');
});

// Start Server (ignored by Vercel)
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Export for Vercel serverless
module.exports = app;
