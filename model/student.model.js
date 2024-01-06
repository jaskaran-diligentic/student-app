const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({

    student_roll: {
        type: Number,
        required: true,
        unique: true,
    },

    student_name: {
        type: String,
        required: true,
    },

    student_email: {
        type: String,
        required: true,
        unique: true,
    },

    profile_image: {
        type: Object,
        required: true
    }

}, { timestamps : true});

const Students = mongoose.model('student', studentSchema);

module.exports = Students;
