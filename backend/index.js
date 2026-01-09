const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const dotenv = require('dotenv');
dotenv.config();

const connectDB = require('./src/config/db');
const apiRoutes = require('./src/routes/index.routes');
const authRoutes = require('./src/routes/authRoutes');
const memberRoutes = require('./src/routes/memberRoutes');

const validateEnv = () => {
  const required = ['MONGODB_URI', 'JWT_SECRET'];
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length) {
    console.error(`Faltan variables de entorno: ${missing.join(', ')}`);
    process.exit(1);
  }
};



const app = express();
const PORT = process.env.PORT || 4000;
const useHelmet = process.env.USE_HELMET !== 'false';

validateEnv();
connectDB();

app.use(cors({
  origin: '*', 
  credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));
if (useHelmet) {
  app.use(helmet());
}

app.use('/api/auth', authRoutes);
app.use('/api/members', memberRoutes);
app.use('/api', apiRoutes);

app.get('/', (_req, res) => {
  res.json({ status: 'ok', message: 'Gym Management API' });
});

app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
