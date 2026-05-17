const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');

const schoolRoutes = require('./routes/schoolRoutes');
const { errorHandler } = require('./middleware/errorHandler');
const { testDbConnection } = require('./config/db');

// Load environment variables from .env
dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/', schoolRoutes);

// Health check (includes DB connectivity status)
app.get('/health', async (req, res) => {
  const dbOk = await testDbConnection();
  res.json({ ok: true, db: dbOk });
});

// Centralized error handler
app.use(errorHandler);

const port = Number(process.env.PORT) || 5000;
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on port ${port}`);
});

// Optional DB connectivity check (non-fatal).
// This helps beginners quickly see whether MySQL config is correct.
testDbConnection().then((ok) => {
  // eslint-disable-next-line no-console
  console.log(`Database connection: ${ok ? 'OK' : 'FAILED'}`);
});
