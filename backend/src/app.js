const express = require('express');
const cors = require('cors');
const jobRoutes = require('./routes/jobRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://job-application-portal-gnnt.onrender.com'
  ]
}));
app.use(express.json());

// Routes
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({ error: { code: 404, message: 'Route not found' } });
});

// Centralized Error Handler
app.use(errorHandler);

module.exports = app;
