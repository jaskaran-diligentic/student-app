const { body, validationResult } = require('express-validator');

const studentValidationRulesForCreate = [
  body('student_roll').trim()
    .notEmpty().withMessage('student roll is required')
    .isInt().withMessage('student roll must be an integer.'),
  body('student_name').trim()
    .notEmpty().withMessage('student name is required.')
    .isAlpha('en-US', { ignore: ' ' }).withMessage('student name must be a string.'),
  body('student_email').trim()
    .notEmpty().withMessage('e-mail is required.')
    .isEmail().normalizeEmail({ gmail_remove_dots: false }).withMessage('Invalid e-mail address'),
  body('profile_image')
    .custom((value, { req }) => {
      if (req.file.mimetype === 'image/jpeg' || req.file.mimetype === 'image/png') {
        return true;
      } else {
        return false;
      }
    }).withMessage('Please upload an image jpeg, jpg, png.'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const formattedErrors = errors.array().map(error => ({
        field: error.param,
        message: error.msg
      }));

      return res.status(400).json({ status:400, errors: formattedErrors });
    }

    next();
  }
];

const studentValidationRulesForUpdate = [
  body('student_roll').optional().trim()
    .notEmpty().withMessage('student roll is required')
    .isInt().withMessage('student roll must be an integer.'),
  body('student_name').optional().trim()
    .notEmpty().withMessage('student name is required.')
    .isAlpha('en-US', { ignore: ' ' }).withMessage('student name must be a string.'),
  body('student_email').optional().trim()
    .notEmpty().withMessage('e-mail is required.')
    .isEmail().normalizeEmail().withMessage('Invalid e-mail address'),
  body('profile_image').optional()
    .custom((value, { req }) => {
      if (req.file.mimetype === 'image/jpeg' || req.file.mimetype === 'image/png') {
        return true;
      } else {
        return false;
      }
    }).withMessage('Please upload an image jpeg, jpg, png.'),

  (req, res, next) => {
    const errors = validationResult(req);

    const updates = Object.keys(req.body);
    if (updates.length === 0) {
      return res.status(400).json({  status:400, errors: [{ field: 'general', message: 'At least one field must be updated.' }] });
    }

    if (!errors.isEmpty()) {
      const formattedErrors = errors.array().map(error => ({
        field: error.param,
        message: error.msg
      }));

      return res.status(400).json({ errors: formattedErrors });
    }

    next();
  }
];

module.exports = {
  studentValidationRulesForCreate,
  studentValidationRulesForUpdate
};


/*
.custom(async roll => {
    const studentRoll = await Students.findOne({ student_roll: roll });
    if (studentRoll) {
      throw new Error('Student roll already in use');
    }
  }),

  .custom(async name => {
    const studentName = await Students.findOne({ student_name: name });
    if (studentName) {
      throw new Error('Student name already in use');
    }
  }),

  .withMessage('Invalid email addresss').custom(async value => {
      const studentEmail = await Students.findOne({ student_email: value });
      if (studentEmail) {
        throw new Error('Student e-mail already in use');
      }
    }),
*/