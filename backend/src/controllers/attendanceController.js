const Attendance = require('../models/Attendance');
const Member = require('../models/Member');

const formatDate = (value) => {
  if (!value) return 'Sin fecha registrada';
  return new Date(value).toLocaleDateString('es-AR');
};

const checkIn = async (req, res) => {
  try {
    const { dni } = req.body;
    const gymId = req.user?.gymId;

    if (!dni) {
      return res.status(400).json({ error: 'dni es obligatorio' });
    }

    const member = await Member.findOne({ dni, gym: gymId });
    if (!member) {
      return res.status(404).json({ error: 'Socio no encontrado' });
    }

    const now = new Date();
    const expirationDate = member.activeUntil;
    const isValid = expirationDate && expirationDate >= now;

    const attendance = await Attendance.create({
      memberId: member._id,
      status: isValid ? 'ACCESS_GRANTED' : 'ACCESS_DENIED',
      checkInMethod: 'SYSTEM',
      gym: gymId,
    });

    const formattedExpiration = formatDate(expirationDate);

    if (isValid) {
      return res.status(200).json({
        attendance,
        message: `Bienvenido ${member.firstName}, Pases restantes/Vencimiento: ${formattedExpiration}`,
      });
    }

    return res.status(403).json({
      attendance,
      message: `ACCESO DENEGADO. Cuota vencida el ${formattedExpiration}`,
    });
  } catch (error) {
    console.error('Check-in error:', error);
    return res.status(500).json({ error: 'No se pudo registrar la asistencia' });
  }
};

module.exports = {
  checkIn,
};

