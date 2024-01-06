const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const Students = require('../model/student.model');
const { ObjectId } = require('mongodb');
const { getPagination } = require('../services/query');
const { actionCompleteResponse, sendError } = require('../utils/responses');

//Get all Students
async function getAllStudents(req, res) {
    try {
        const { skip, limit } = getPagination(req.query);
        const all_students = await Students
            .find({}, { '__v': 0 })
            .sort({ student_roll: 1 })
            .skip(skip)
            .limit(limit)
        return actionCompleteResponse({ res, data: all_students });
    } catch (error) {
        console.log(error);
        return sendError({ res, error });
    }
}

// Get One Student
async function getStudent(req, res) {

    try {

        if (!ObjectId.isValid(req.params.id)) {
            throw 'NOT_VALID_DOCUMENT_ID';
        }

        const student = await Students.findOne({ _id: new ObjectId(req.params.id) }, { '__v': 0 });
        if (!student) {
            throw 'NO_DATA_FOUND';
        }

        return actionCompleteResponse({ res, data: student });
    } catch (error) {
        console.log(error);
        return sendError({ res, error });
    }
}

// Delete Student
async function deleteStudent(req, res) {
    try {

        if (!ObjectId.isValid(req.params.id)) {
            throw 'NOT_VALID_DOCUMENT_ID';
        }

        const student = await Students.findOne({ _id: new ObjectId(req.params.id) });
        if (!student) {
            throw 'NO_DATA_FOUND';
        }

        const deletedStudent = await Students.deleteOne({ _id: new ObjectId(req.params.id) });

        const imageID = student.profile_image.public_id;

        if (deletedStudent.deletedCount > 0) {
            const deleteImage = await cloudinary.uploader.destroy(imageID);
        }
        return actionCompleteResponse({ res, data: student });
    } catch (error) {
        console.log(error);
        return sendError({ res, error });
    }

}

// Create a Student
async function addNewStudent(req, res) {

    try {
        const { student_roll, student_name, student_email } = req.body;

        // console.log(typeof student_name)
        const existingStudentID = await Students.findOne({ student_roll });
        if (existingStudentID) {
            //    throw 'USER_ALREADY_EXISTS';
            return res.status(400).json({ status: 400, message: `Student RollNo. '${student_roll}' already exists in the database.` });
        }

        const existingStudentEmail = await Students.findOne({ student_email });
        if (existingStudentEmail) {
            // throw 'USER_ALREADY_EXISTS';
            return res.status(400).json({ status: 400, message: `Student email '${student_email}' already exists in the database.` });
        }

        const result = await cloudinary.uploader.upload(req.file.path, { resource_type: 'image' });
        const newStudent = await Students.create({
            student_roll,
            student_name,
            student_email,
            profile_image: {
                public_id: result.public_id,
                secure_url: result.secure_url
            }
        });
        fs.unlinkSync(req.file.path); //delete image from local upload folder.
        return actionCompleteResponse({ res, data: newStudent });
    } catch (error) {
        console.error(error);
        return sendError({ res, error });
    }
}

// Update Student Data
async function updateStudent(req, res) {

    try {
        const updates = req.body;

        if (!ObjectId.isValid(req.params.id)) {
            throw 'NOT_VALID_DOCUMENT_ID';
        }

        const student = await Students.findOne({ _id: new ObjectId(req.params.id) });
        if (!student) {
            throw 'NO_DATA_FOUND';
        }

        const existingStudentID = await Students.findOne({ student_roll: updates.student_roll });
        if (existingStudentID) {
            //throw 'USER_ALREADY_EXISTS';
            return res.status(400).json({ status: 400, message: `Student roll no. '${updates.student_roll}' already exists in the database.` })
        }

        const existingStudentName = await Students.findOne({ student_name: updates.student_name });
        if (existingStudentName) {
            //throw 'USER_ALREADY_EXISTS';
            return res.status(400).json({ status: 400, message: `Student name '${updates.student_name}' already exists in the database.` })
        }

        const existingStudentEmail = await Students.findOne({ student_email: updates.student_email });
        if (existingStudentEmail) {
            //throw 'USER_ALREADY_EXISTS';
            return res.status(400).json({ status: 400, message: `Student email '${updates.student_email}' already exists in the database.` })
        }

        if (req.file) {
            const existingStudentImage = await Students.findOne({ _id: new ObjectId(req.params.id) });
            const imageID = existingStudentImage.profile_image.public_id;

            if (existingStudentImage.profile_image && imageID) {
                const deletePreviousImage = await cloudinary.uploader.destroy(imageID);
            }

            const newImage = await cloudinary.uploader.upload(req.file.path);
            updates.profile_image = {
                public_id: newImage.public_id,
                secure_url: newImage.secure_url
            };
        }

        const updatedStudent = await Students.findByIdAndUpdate({ _id: new ObjectId(req.params.id) }, updates, {new: true});
        return actionCompleteResponse({ res, data: updatedStudent });
    } catch (error) {
        console.log('updateStudent error: ', error);
        return sendError({ res, error });
    }
}


module.exports = {
    getAllStudents,
    getStudent,
    deleteStudent,
    addNewStudent,
    updateStudent
}