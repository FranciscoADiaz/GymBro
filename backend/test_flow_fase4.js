const axios = require('axios');

const BASE_URL = process.env.BASE_URL || 'http://localhost:4000';
const JWT_TOKEN = process.env.JWT_TOKEN;

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

const logInfo = (message) => console.log(`${colors.blue}ℹ ${message}${colors.reset}`);
const logOk = (message) => console.log(`${colors.green}✅ ${message}${colors.reset}`);
const logWarn = (message) => console.log(`${colors.yellow}⚠ ${message}${colors.reset}`);
const logErr = (message) => console.log(`${colors.red}❌ ${message}${colors.reset}`);

const client = axios.create({
  baseURL: BASE_URL,
  headers: JWT_TOKEN ? { Authorization: `Bearer ${JWT_TOKEN}` } : undefined,
  timeout: 15000,
});

const ensureToken = () => {
  if (!JWT_TOKEN) {
    logErr('Falta JWT_TOKEN en variables de entorno.');
    logWarn('Ejemplo: JWT_TOKEN="..." node test_flow_fase4.js');
    process.exit(1);
  }
};

const formatDateISO = (date) => new Date(date).toISOString();

const main = async () => {
  ensureToken();

  logInfo(`Base URL: ${BASE_URL}`);

  const suffix = Date.now();
  const dni = `99${String(suffix).slice(-8)}`;
  const email = `test.user.${suffix}@example.com`;

  let memberId;

  try {
    logInfo('Creando clase "Zumba Test"...');
    await client.post('/api/classes', {
      name: 'Zumba Test',
      schedule: 'Martes y Jueves 18hs',
      capacity: 20,
      trainer: 'Trainer QA',
    });
    logOk('Clase creada');
  } catch (error) {
    if (error.response?.status === 400) {
      logWarn('La clase ya existe o datos inválidos. Continuando...');
    } else {
      logErr(`Error creando clase: ${error.response?.data?.error || error.message}`);
      process.exit(1);
    }
  }

  try {
    logInfo('Listando clases...');
    const response = await client.get('/api/classes');
    const found = (response.data || []).some((item) => item.name === 'Zumba Test');
    if (found) {
      logOk('Clase "Zumba Test" encontrada en la lista');
    } else {
      logErr('No se encontró la clase "Zumba Test"');
      process.exit(1);
    }
  } catch (error) {
    logErr(`Error listando clases: ${error.response?.data?.error || error.message}`);
    process.exit(1);
  }

  try {
    logInfo('Creando socio "Test User"...');
    const response = await client.post('/api/members', {
      firstName: 'Test',
      lastName: 'User',
      dni,
      email,
      phone: '111111111',
    });
    memberId = response.data?._id;
    if (!memberId) {
      throw new Error('No se recibió _id del socio');
    }
    logOk(`Socio creado con id ${memberId}`);
  } catch (error) {
    logErr(`Error creando socio: ${error.response?.data?.error || error.message}`);
    process.exit(1);
  }

  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const nextMonth = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  try {
    logInfo('ESCENARIO A: Deudor (actualizando activeUntil a fecha pasada)...');
    await client.put(`/api/members/${memberId}`, {
      activeUntil: formatDateISO(yesterday),
    });
    logOk('Socio actualizado con fecha vencida');
  } catch (error) {
    logErr(`Error actualizando socio (deudor): ${error.response?.data?.error || error.message}`);
    process.exit(1);
  }

  try {
    logInfo('Intentando check-in (deudor)...');
    await client.post('/api/attendance/check-in', { dni });
    logErr('PRUEBA DEUDOR FALLÓ (esperaba 403)');
  } catch (error) {
    const status = error.response?.status;
    const message = error.response?.data?.message || '';
    if (status === 403 && message.toLowerCase().includes('acceso denegado')) {
      logOk('PRUEBA DEUDOR PASADA');
    } else {
      logErr(`PRUEBA DEUDOR FALLÓ (${status || 'sin status'})`);
    }
  }

  try {
    logInfo('ESCENARIO B: Socio al día (actualizando activeUntil a fecha futura)...');
    await client.put(`/api/members/${memberId}`, {
      activeUntil: formatDateISO(nextMonth),
    });
    logOk('Socio actualizado con fecha futura');
  } catch (error) {
    logErr(`Error actualizando socio (al día): ${error.response?.data?.error || error.message}`);
    process.exit(1);
  }

  try {
    logInfo('Intentando check-in (socio al día)...');
    const response = await client.post('/api/attendance/check-in', { dni });
    const message = response.data?.message || '';
    if (response.status === 200 && message.toLowerCase().includes('bienvenido')) {
      logOk('PRUEBA ACCESO PASADA');
    } else {
      logErr('PRUEBA ACCESO FALLÓ');
    }
  } catch (error) {
    logErr(`PRUEBA ACCESO FALLÓ (${error.response?.status || 'sin status'})`);
  }
};

main().catch((error) => {
  logErr(`Error inesperado: ${error.message}`);
  process.exit(1);
});

