// server.js - Main Express server file
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db');

// Create Express app
const app = express();

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies

// API Routes
const manufacturersRouter = require('./routes/manufacturers');
const modelsRouter = require('./routes/models');
const carsRouter = require('./routes/cars');
const optionsRouter = require('./routes/options');
const customersRouter = require('./routes/customers');
const employeesRouter = require('./routes/employees');
const salesRouter = require('./routes/sales');
const paymentsRouter = require('./routes/payments');
const testDrivesRouter = require('./routes/testDrives');

// Register API routes
app.use('/api/manufacturers', manufacturersRouter);
app.use('/api/models', modelsRouter);
app.use('/api/cars', carsRouter);
app.use('/api/options', optionsRouter);
app.use('/api/customers', customersRouter);
app.use('/api/employees', employeesRouter);
app.use('/api/sales', salesRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/test-drives', testDrivesRouter);

// Home route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Car Dealership API' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 