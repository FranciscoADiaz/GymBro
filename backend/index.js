require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const connectDB = require('./src/config/db');

// Rutas
const authRoutes = require('./src/routes/authRoutes');
const memberRoutes = require('./src/routes/memberRoutes');

// --- VALIDACIÓN DE ENTORNO ---
const validateEnv = () => {
  const required = ['MONGODB_URI', 'JWT_SECRET', 'FRONTEND_URL'];
  const missing = required.filter((key) => !process.env[key]);
  
  if (missing.length) {
    console.error(`❌ FATAL ERROR: Faltan variables de entorno: ${missing.join(', ')}`);
    process.exit(1);
  }
};
validateEnv();

// --- CONFIGURACIÓN INICIAL ---
const app = express();
const PORT = process.env.PORT || 4000;
connectDB(); // Conectar a BD

// --- SEGURIDAD Y MIDDLEWARES ---
const whitelist = [
  process.env.FRONTEND_URL,         
  'http://localhost:5173',          
  'http://localhost:3000'            
];

const corsOptions = {
  origin: function (origin, callback) {
    // !origin permite peticiones server-to-server o herramientas como Postman
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log(`🚫 Bloqueado por CORS: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Permite cookies y headers de autorización
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));

// 2. Headers de Seguridad (Helmet)
app.use(helmet()); 

// 3. Logging y Parsing
app.use(morgan('dev')); 
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

// --- RUTAS ---
app.get('/', (_req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'API is running 🚀', 
    env: process.env.NODE_ENV 
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/members', memberRoutes);
// app.use('/api', apiRoutes); 

// --- MANEJO DE ERRORES GLOBAL ---
app.use((err, _req, res, _next) => {
  console.error('🔥 Error:', err.message);
  
  // No mostrar detalles técnicos (stack) en producción por seguridad
  const response = {
    error: true,
    message: err.message || 'Internal Server Error'
  };

  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  res.status(err.status || 500).json(response);
});

// --- INICIO DEL SERVIDOR ---
const server = app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en puerto ${PORT}`);
  console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🛡️ CORS permitido para: ${whitelist.join(', ')}`);
});

// --- APAGADO AGRADABLE (Graceful Shutdown) ---
// Esto evita que la BD quede con conexiones fantasma si reinicias el server
process.on('SIGTERM', () => {
  console.info('SIGTERM signal received.');
  server.close(() => {
    console.log('Http server closed.');
    // Aquí podrías cerrar la conexión a Mongo también explícitamente si quisieras
    process.exit(0);
  });
});

module.exports = app;
