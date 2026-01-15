const crypto = require('crypto');
const Gym = require('../models/Gym');

const generateInviteCode = async () => {
  let code;
  let exists = true;
  while (exists) {
    code = crypto.randomBytes(4).toString('hex').toUpperCase();
    // eslint-disable-next-line no-await-in-loop
    exists = await Gym.findOne({ inviteCode: code });
  }
  return code;
};

module.exports = { generateInviteCode };

