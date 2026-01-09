const { body, validationResult } = require('express-validator');

const memberValidationRules = [
  body('firstName').notEmpty().withMessage('firstName es obligatorio'),
  body('lastName').notEmpty().withMessage('lastName es obligatorio'),
  body('dni').notEmpty().withMessage('dni es obligatorio'),
  body('email').optional().isEmail().withMessage('email no es válido'),
];

const validateMember = [
  ...memberValidationRules,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }
    return next();
  },
];

module.exports = { validateMember };

