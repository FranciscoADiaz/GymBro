/* global fetch */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Gym = require('../models/Gym');
const { generateInviteCode } = require('../utils/inviteCode');

const JWT_SECRET = process.env.JWT_SECRET || 'change-me';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

const generateToken = (userId, role, gymId) =>
  jwt.sign({ id: userId, role, gymId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

const sanitizeUser = (user) => {
  const obj = user.toObject();
  delete obj.password;
  return obj;
};

const register = async (req, res) => {
  try {
    const { name, email, password, role, gymName, gymInviteCode } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Nombre, email y contraseña son obligatorios' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ error: 'El email ya está registrado' });
    }

    let gym;
    if (role === 'entrenador') {
      if (!gymInviteCode) {
        return res.status(400).json({ error: 'El código del gimnasio es obligatorio' });
      }
      gym = await Gym.findOne({ inviteCode: gymInviteCode });
      if (!gym) {
        return res.status(400).json({ error: 'Código de gimnasio inválido' });
      }
    } else {
      if (!gymName) {
        return res.status(400).json({ error: 'El nombre del gimnasio es obligatorio' });
      }
      const inviteCode = await generateInviteCode();
      gym = await Gym.create({ name: gymName, inviteCode });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
      gym: gym._id,
    });

    if (role !== 'entrenador') {
      gym.owner = user._id;
      await gym.save();
    }

    const token = generateToken(user._id, user.role, user.gym);
    const response = { token, user: sanitizeUser(user) };
    if (role !== 'entrenador') {
      response.gymInviteCode = gym.inviteCode;
    }
    return res.status(201).json(response);
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ error: 'No se pudo registrar el usuario' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son obligatorios' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = generateToken(user._id, user.role, user.gym);
    return res.status(200).json({ token, user: sanitizeUser(user) });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'No se pudo iniciar sesión' });
  }
};

const createStaff = async (req, res) => {
  try {
    const { name, email, password, role = 'entrenador' } = req.body;
    const gymId = req.user?.gymId;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Nombre, email y contraseña son obligatorios' });
    }
    if (!gymId) {
      return res.status(400).json({ error: 'Gym no válido' });
    }

    if (req.user?.role !== 'admin') {
      return res.status(403).json({ error: 'No autorizado' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ error: 'El email ya está registrado' });
    }

    // #region agent log
    fetch('http://127.0.0.1:7245/ingest/b20702a8-7c6e-40da-affb-9b2d732f56e4',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'authController.js:createStaff',message:'creating staff user',data:{gymId,role,email:email.toLowerCase()},timestamp:Date.now(),sessionId:'debug-session',runId:'trainer-fix',hypothesisId:'H3'})}).catch(()=>{});
    // #endregion

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
      gym: gymId,
    });

    // #region agent log
    fetch('http://127.0.0.1:7245/ingest/b20702a8-7c6e-40da-affb-9b2d732f56e4',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'authController.js:createStaff',message:'staff user created',data:{userId:user._id,gymId:user.gym,role:user.role},timestamp:Date.now(),sessionId:'debug-session',runId:'trainer-fix',hypothesisId:'H4'})}).catch(()=>{});
    // #endregion

    return res.status(201).json({ user: sanitizeUser(user) });
  } catch (error) {
    console.error('Create staff error:', error);
    return res.status(500).json({ error: 'No se pudo crear el usuario' });
  }
};

module.exports = {
  register,
  login,
  createStaff,
};

