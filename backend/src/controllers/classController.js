const ClassModel = require('../models/Class');

const createClass = async (req, res) => {
  try {
    const { name, schedule, capacity, trainer } = req.body;
    const gymId = req.user?.gymId;

    if (!name) {
      return res.status(400).json({ error: 'name es obligatorio' });
    }

    const classItem = await ClassModel.create({
      name,
      schedule,
      capacity,
      trainer,
      gym: gymId,
    });

    return res.status(201).json(classItem);
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
      return res.status(400).json({ error: 'La clase ya existe' });
    }
    console.error('Create class error:', error);
    return res.status(500).json({ error: 'No se pudo crear la clase' });
  }
};

const getAllClasses = async (req, res) => {
  try {
    const gymId = req.user?.gymId;
    const classes = await ClassModel.find({ gym: gymId }).sort({ createdAt: -1 });
    return res.status(200).json(classes);
  } catch (error) {
    console.error('Get classes error:', error);
    return res.status(500).json({ error: 'No se pudieron obtener las clases' });
  }
};

const deleteClass = async (req, res) => {
  try {
    const { id } = req.params;
    const gymId = req.user?.gymId;
    const classItem = await ClassModel.findOneAndDelete({ _id: id, gym: gymId });
    if (!classItem) {
      return res.status(404).json({ error: 'Clase no encontrada' });
    }
    return res.status(200).json({ message: 'Clase eliminada correctamente' });
  } catch (error) {
    console.error('Delete class error:', error);
    return res.status(500).json({ error: 'No se pudo eliminar la clase' });
  }
};

module.exports = {
  createClass,
  getAllClasses,
  deleteClass,
};

