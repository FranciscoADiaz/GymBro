const Member = require('../models/Member');
const Membership = require('../models/Membership');
const Payment = require('../models/Payment');
const axios = require('axios');


const createPayment = async (req, res) => {
  try {
    const { memberId, membershipId } = req.body;
    const gymId = req.user?.gymId;

    if (!memberId || !membershipId) {
      return res.status(400).json({ error: 'memberId y membershipId son obligatorios' });
    }

    const membership = await Membership.findOne({ _id: membershipId, gym: gymId });
    if (!membership) {
      return res.status(404).json({ error: 'Membresía no encontrada' });
    }

    const member = await Member.findOne({ _id: memberId, gym: gymId });
    if (!member) {
      return res.status(404).json({ error: 'Socio no encontrado' });
    }

    const now = new Date();
    const baseDate = member.activeUntil && member.activeUntil > now ? member.activeUntil : now;
    const newActiveUntil = new Date(baseDate.getTime() + membership.durationInDays * 24 * 60 * 60 * 1000);

    const payment = await Payment.create({
      member: member._id,
      amount: membership.price,
      membershipType: membership.name,
      gym: gymId,
    });

    member.activeUntil = newActiveUntil;
    member.status = 'active';
    await member.save();



    try {
      const n8nUrlPago = process.env.NGROK_URL_PAGO; 
      
      axios.post(n8nUrlPago, {
          firstName: member.firstName,
          lastName: member.lastName,
          email: member.email,
          dni: member.dni,
          gymId: gymId 
      }).catch(err => console.error('⚠️ Error enviando webhook a n8n:', err.message));
      
  } catch (notificationError) {
      console.error('Error interno al intentar notificar:', notificationError);
  }


    return res.status(201).json({ payment, member });
  } catch (error) {
    console.error('Create payment error:', error);
    return res.status(500).json({ error: 'No se pudo registrar el pago' });
  }
};

module.exports = {
  createPayment,
};

