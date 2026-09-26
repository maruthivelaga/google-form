import * as studentService from '../services/studentService.js';

export const lookupStudent = async (req, res) => {
    try {
        const { regNo } = req.params;
        const student = await studentService.lookupStudentByReg(regNo);
        if (!student) {
            return res.status(200).json({ exists: false, message: 'Registration number not found' });
        }
        return res.status(200).json({
            exists: true,
            student
        });
    } catch (error) {
        console.error('Error looking up student:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export const submitForm = async (req, res) => {
    try {
        const result = await studentService.submitStudentForm(req.body);
        return res.status(200).json({
            success: true,
            message: 'Student information has been submitted successfully.',
            registration_number: result.registration_number,
            student: result
        });
    } catch (error) {
        if (error.status) {
            return res.status(error.status).json({ message: error.message });
        }
        console.error('Error submitting student form:', error);
        return res.status(500).json({ message: 'Server error while submitting form.' });
    }
};
