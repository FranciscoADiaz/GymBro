const Gym = require('../models/Gym');
const { generateInviteCode } = require('../utils/inviteCode');

const regenerateInviteCode = async (req, res) => {
  try {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ error: 'No autorizado' });
    }
    const gymId = req.user?.gymId;
    const gym = await Gym.findById(gymId);
    if (!gym) {
      return res.status(404).json({ error: 'Gimnasio no encontrado' });
    }

    const inviteCode = await generateInviteCode();
    gym.inviteCode = inviteCode;
    await gym.save();

    return res.status(200).json({ inviteCode });
  } catch (error) {
    console.error('Regenerate invite code error:', error);
    return res.status(500).json({ error: 'No se pudo regenerar el código' });
  }
};

const getInviteCode = async (req, res) => {
  try {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ error: 'No autorizado' });
    }
    const gymId = req.user?.gymId;
    const gym = await Gym.findById(gymId).select('inviteCode');
    if (!gym) {
      return res.status(404).json({ error: 'Gimnasio no encontrado' });
    }
    return res.status(200).json({ inviteCode: gym.inviteCode });
  } catch (error) {
    console.error('Get invite code error:', error);
    return res.status(500).json({ error: 'No se pudo obtener el código' });
  }
};

module.exports = {
  regenerateInviteCode,
  getInviteCode,
};

