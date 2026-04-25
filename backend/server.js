// backend/server.js
const express = require('express');
const cors = require('cors');

// Update your CORS configuration to look like this:
app.use(cors({
    origin: [
        'http://localhost:5173', 
        'https://playbound.vercel.app' // Make sure there is NO trailing slash (/) at the end!
    ],
    credentials: true
}));
const connectDB = require('./config/db');
require('dotenv').config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// Middleware
// backend/server.js
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json()); // Allows us to parse incoming JSON data from requests

// API Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/requests', require('./routes/requestRoutes'));

// Basic Health Check Route
app.get('/', (req, res) => {
    res.send('Game Partner Finder API is running...');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});