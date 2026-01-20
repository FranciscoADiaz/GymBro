const Member = require('../models/Member');

const buildNameRegexFilter = (search) => {
  if (!search) return null;
  const regex = new RegExp(search, 'i');
  return [{ firstName: regex }, { lastName: regex }];
};

const createMember = async (req, res) => {
  try {
    const { firstName, lastName, dni, email, phone, dateOfBirth, profileImage, status, joinDate } = req.body;
    const gymId = req.user?.gymId;

    if (!firstName || !lastName || !dni || !email) {
      return res.status(400).json({
        mensaje: 'Error de validación',
        errores: [
          {
            campo: 'firstName/lastName/dni/email',
            mensaje: 'firstName, lastName, dni y email son obligatorios',
          },
        ],
      });
    }

    const existingMember = await Member.findOne({ $or: [{ dni }, { email }] });
    if (existingMember) {
      return res.status(400).json({
        mensaje: 'Dato duplicado',
        errores: [{ campo: 'dni/email', mensaje: 'El DNI o Email ya están registrados' }],
      });
    }

    const member = await Member.create({
      firstName,
      lastName,
      dni,
      email,
      phone,
      dateOfBirth,
      profileImage,
      status,
      joinDate,
      gym: gymId,
    });

    return res.status(201).json(member);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors || {}).map((err) => ({
        campo: err.path,
        mensaje: err.message,
      }));
      return res.status(400).json({
        mensaje: 'Error de validación',
        errores: validationErrors,
      });
    }
    if (error.code === 11000) {
      const duplicatedField = Object.keys(error.keyPattern || {})[0];
      return res.status(400).json({
        mensaje: 'Dato duplicado',
        errores: [{ campo: duplicatedField, mensaje: `${duplicatedField} ya existe` }],
      });
    }
    console.error('Create member error:', error);
    return res.status(500).json({ error: 'No se pudo crear el socio' });
  }
};

const getAllMembers = async (req, res) => {
  try {
    const { status, search } = req.query;
    const gymId = req.user?.gymId;
    const now = new Date();

    const filter = { gym: gymId };
    if (status) {
      filter.status = status;
    }

    const nameFilters = buildNameRegexFilter(search);
    if (nameFilters) {
      filter.$or = nameFilters;
    }

    const [toActiveResult, toInactiveResult] = await Promise.all([
      Member.updateMany(
        { gym: gymId, activeUntil: { $gt: now }, status: { $ne: 'active' } },
        { $set: { status: 'active' } }
      ),
      Member.updateMany(
        { gym: gymId, $or: [{ activeUntil: { $lte: now } }, { activeUntil: null }], status: { $ne: 'inactive' } },
        { $set: { status: 'inactive' } }
      ),
    ]);

    const members = await Member.find(filter).sort({ createdAt: -1 });
    // #region agent log
    fetch('http://127.0.0.1:7245/ingest/b20702a8-7c6e-40da-affb-9b2d732f56e4',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'memberController.js:getAllMembers',message:'members fetched',data:{gymId,memberCount:members.length,filterKeys:Object.keys(filter)},timestamp:Date.now(),sessionId:'debug-session',runId:'trainer-issue',hypothesisId:'H2'})}).catch(()=>{});
    // #endregion

    return res.status(200).json(members);
  } catch (error) {
    console.error('Get members error:', error);
    return res.status(500).json({ error: 'No se pudieron obtener los socios' });
  }
};

const getMemberById = async (req, res) => {
  try {
    const { id } = req.params;
    const gymId = req.user?.gymId;
    const now = new Date();
    const member = await Member.findOne({ _id: id, gym: gymId });
    if (!member) {
      return res.status(404).json({ error: 'Socio no encontrado' });
    }
    const shouldBeActive = member.activeUntil && member.activeUntil > now;
    const nextStatus = shouldBeActive ? 'active' : 'inactive';
    if (member.status !== nextStatus) {
      await Member.updateOne({ _id: member._id }, { $set: { status: nextStatus } });
      member.status = nextStatus;
    }
    return res.status(200).json(member);
  } catch (error) {
    console.error('Get member error:', error);
    return res.status(500).json({ error: 'No se pudo obtener el socio' });
  }
};

const updateMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { dni } = req.body;
    const gymId = req.user?.gymId;

    if (dni) {
      const existingDni = await Member.findOne({ dni, _id: { $ne: id }, gym: gymId });
      if (existingDni) {
        return res.status(400).json({ error: 'El DNI ya existe' });
      }
    }

    const member = await Member.findOneAndUpdate({ _id: id, gym: gymId }, req.body, {
      new: true,
      runValidators: true,
    });

    if (!member) {
      return res.status(404).json({ error: 'Socio no encontrado' });
    }

    // #region agent log
    fetch('http://127.0.0.1:7245/ingest/b20702a8-7c6e-40da-affb-9b2d732f56e4',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'memberController.js:updateMember',message:'member updated',data:{memberId:member._id,status:member.status,activeUntil:member.activeUntil || null,gymId},timestamp:Date.now(),sessionId:'debug-session',runId:'status-pre',hypothesisId:'H3'})}).catch(()=>{});
    // #endregion
    return res.status(200).json(member);
  } catch (error) {
    if (error.code === 11000) {
      const duplicatedField = Object.keys(error.keyPattern || {})[0];
      return res.status(400).json({ error: `${duplicatedField} ya existe` });
    }
    console.error('Update member error:', error);
    return res.status(500).json({ error: 'No se pudo actualizar el socio' });
  }
};

const deleteMember = async (req, res) => {
  try {
    const { id } = req.params;
    const gymId = req.user?.gymId;
    const member = await Member.findOneAndDelete({ _id: id, gym: gymId });
    if (!member) {
      return res.status(404).json({ error: 'Socio no encontrado' });
    }
    return res.status(200).json({ message: 'Socio eliminado correctamente' });
  } catch (error) {
    console.error('Delete member error:', error);
    return res.status(500).json({ error: 'No se pudo eliminar el socio' });
  }
};

module.exports = {
  createMember,
  getAllMembers,
  getMemberById,
  updateMember,
  deleteMember,
};

