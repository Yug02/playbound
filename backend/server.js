const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();

// Connect to MongoDB
connectDB();

// 1. Initialize Express app
const app = express();

// 2. Middleware: Single, correct CORS configuration
app.use(cors({
    origin: [
        'http://localhost:5173', 
        'https://playbound.vercel.app' // Your live frontend URL
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// 3. Middleware: Parse JSON
app.use(express.json()); 

// 4. API Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/requests', require('./routes/requestRoutes'));

// 5. Basic Health Check Route
app.get('/', (req, res) => {
    res.send('Game Partner Finder API is running...');
});

// 6. Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});