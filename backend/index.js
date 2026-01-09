require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const connectDB = require('./src/config/db');


const authRoutes = require('./src/routes/authRoutes');
const memberRoutes = require('./src/routes/memberRoutes');

const validateEnv = () => {
  const required = ['MONGODB_URI', 'JWT_SECRET', 'FRONTEND_URL'];
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length) {
    console.error(`❌ ERROR FATAL: Faltan variables de entorno: ${missing.join(', ')}`);
    process.exit(1);
  }
};

validateEnv();
connectDB();

const app = express();
const PORT = process.env.PORT || 4000;

const whitelist = [
  process.env.FRONTEND_URL,         
  'http://localhost:5173',           
  'http://localhost:3000'            
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log(`🚫 Bloqueado por CORS: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};


app.use(cors(corsOptions));
app.use(helmet()); 
app.use(morgan('dev')); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));


app.get('/', (_req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Gym Management System API 🏋️‍♂️', 
    version: '1.0.0' 
  });
});


app.use('/api/auth', authRoutes);      
app.use('/api/members', memberRoutes); 


app.use((err, _req, res, _next) => {
  console.error('🔥 Error detectado:', err.message);
  
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(status).json({
    error: true,
    message: message,
  
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});


app.listen(PORT, () => {
  console.log(`✅ Servidor del Gym corriendo en puerto ${PORT}`);
  console.log(`🛡️  CORS habilitado para: ${whitelist.join(', ')}`);
});

module.exports = app;
