require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const citizenRoutes = require('./routes/citizens');
const schemeRoutes = require('./routes/schemes');

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/citizens', citizenRoutes);
app.use('/api/schemes', schemeRoutes);

// Health Check
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'JanSevAI Server is running' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
