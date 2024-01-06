const express = require('express');
const {
    getAllStudents,
    addNewStudent,
    getStudent,
    deleteStudent,
    updateStudent,

} = require('../controller/student.controller');

const { studentValidationRulesForCreate, studentValidationRulesForUpdate } = require('../middlewares/student.validation');
const upload = require('../services/cloudinary');
const studentRouter = express.Router();

// --- Student Router ---
studentRouter.get('/', getAllStudents);
studentRouter.get('/:id', getStudent);
studentRouter.post('/', upload.single('profile_image'), studentValidationRulesForCreate, addNewStudent);
studentRouter.delete('/:id', deleteStudent);
studentRouter.patch('/:id', upload.single('profile_image'), studentValidationRulesForUpdate, updateStudent);

module.exports = studentRouter;