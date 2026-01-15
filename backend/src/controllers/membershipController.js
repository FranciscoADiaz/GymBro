const Membership = require('../models/Membership');

const createMembership = async (req, res) => {
  try {
    const { name, price, durationInDays } = req.body;
    const gymId = req.user?.gymId;

    if (!name || price == null || durationInDays == null) {
      return res.status(400).json({ error: 'Nombre, precio y duración son obligatorios' });
    }

    if (Number(price) < 0 || Number(durationInDays) <= 0) {
      return res.status(400).json({ error: 'Precio y duración deben ser mayores a cero' });
    }

    const existing = await Membership.findOne({ gym: gymId, name });
    if (existing) {
      return res.status(409).json({ error: 'Ya existe una membresía con ese nombre' });
    }

    const membership = await Membership.create({
      name,
      price,
      durationInDays,
      gym: gymId,
    });

    return res.status(201).json(membership);
  } catch (error) {
    console.error('Create membership error:', error);
    return res.status(500).json({ error: 'No se pudo crear la membresía' });
  }
};

const getAllMemberships = async (req, res) => {
  try {
    const gymId = req.user?.gymId;
    const memberships = await Membership.find({ gym: gymId }).sort({ createdAt: -1 });
    return res.status(200).json(memberships);
  } catch (error) {
    console.error('Get memberships error:', error);
    return res.status(500).json({ error: 'No se pudieron obtener las membresías' });
  }
};

const deleteMembership = async (req, res) => {
  try {
    const { id } = req.params;
    const gymId = req.user?.gymId;
    const membership = await Membership.findOneAndDelete({ _id: id, gym: gymId });
    if (!membership) {
      return res.status(404).json({ error: 'Membresía no encontrada' });
    }
    return res.status(200).json({ message: 'Membresía eliminada correctamente' });
  } catch (error) {
    console.error('Delete membership error:', error);
    return res.status(500).json({ error: 'No se pudo eliminar la membresía' });
  }
};

module.exports = {
  createMembership,
  getAllMemberships,
  deleteMembership,
};

