require('dotenv').config();

const express  = require('express');
const cors     = require('cors');

// Routes
const customerRoutes  = require('./routes/customer');
// const productRoutes   = require('./routes/product');
// const storeRoutes     = require('./routes/store');
// const timeRoutes      = require('./routes/time');
// const salesRoutes     = require('./routes/sales');
// const analyticsRoutes = require('./routes/analytics');
const { notFoundHandler, globalErrorHandler } = require('./middleware/errorHandler');

const app    = express();
const PREFIX = process.env.API_PREFIX || '/api/v1';

// Middleware Global
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Report Logger (DEV)
if (process.env.NODE_ENV === 'development') {
  app.use((req, _res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
  });
}

// Health Check
app.get(`${PREFIX}/health`, (_req, res) => {
  res.status(200).json({
    status: true,
    message: 'RetailView Analytics API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Api Routes
app.use(`${PREFIX}/customers`, customerRoutes);
// app.use(`${PREFIX}/products`, productRoutes);
// app.use(`${PREFIX}/stores`, storeRoutes);
// app.use(`${PREFIX}/time`, timeRoutes);
// app.use(`${PREFIX}/sales`, salesRoutes);
// app.use(`${PREFIX}/analytics`, analyticsRoutes);

// Error Handlers
app.use(notFoundHandler);
app.use(globalErrorHandler);

module.exports = app;