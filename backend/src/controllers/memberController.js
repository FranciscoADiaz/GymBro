const Member = require('../models/Member');

const buildNameRegexFilter = (search) => {
  if (!search) return null;
  const regex = new RegExp(search, 'i');
  return [{ firstName: regex }, { lastName: regex }];
};

const createMember = async (req, res) => {
  try {
    const { firstName, lastName, dni, email, phone, dateOfBirth, profileImage, status, joinDate } = req.body;

    if (!firstName || !lastName || !dni) {
      return res.status(400).json({ error: 'firstName, lastName y dni son obligatorios' });
    }

    const existingDni = await Member.findOne({ dni });
    if (existingDni) {
      return res.status(400).json({ error: 'El DNI ya existe' });
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
    });

    return res.status(201).json(member);
  } catch (error) {
    if (error.code === 11000) {
      const duplicatedField = Object.keys(error.keyPattern || {})[0];
      return res.status(400).json({ error: `${duplicatedField} already exists` });
    }
    console.error('Create member error:', error);
    return res.status(500).json({ error: 'No se pudo crear el socio' });
  }
};

const getAllMembers = async (req, res) => {
  try {
    const { status, search } = req.query;

    const filter = {};
    if (status) {
      filter.status = status;
    }

    const nameFilters = buildNameRegexFilter(search);
    if (nameFilters) {
      filter.$or = nameFilters;
    }

    const members = await Member.find(filter).sort({ createdAt: -1 });

    return res.status(200).json(members);
  } catch (error) {
    console.error('Get members error:', error);
    return res.status(500).json({ error: 'No se pudieron obtener los socios' });
  }
};

const getMemberById = async (req, res) => {
  try {
    const { id } = req.params;
    const member = await Member.findById(id);
    if (!member) {
      return res.status(404).json({ error: 'Socio no encontrado' });
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

    if (dni) {
      const existingDni = await Member.findOne({ dni, _id: { $ne: id } });
      if (existingDni) {
        return res.status(400).json({ error: 'El DNI ya existe' });
      }
    }

    const member = await Member.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!member) {
      return res.status(404).json({ error: 'Socio no encontrado' });
    }

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
    const member = await Member.findByIdAndDelete(id);
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

