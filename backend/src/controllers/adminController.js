import * as studentService from '../services/studentService.js';
import xlsx from 'xlsx';

export const getStats = async (req, res) => {
    try {
        const filters = {
            batch: req.query.batch,
            branch: req.query.branch
        };
        const stats = await studentService.getAdminStats(filters);
        return res.status(200).json(stats);
    } catch (error) {
        console.error('Error fetching admin stats:', error);
        return res.status(500).json({ error: 'Failed to fetch admin stats' });
    }
};

export const getSections = async (req, res) => {
    try {
        const filters = {
            batch: req.query.batch,
            branch: req.query.branch
        };
        const sections = await studentService.getAdminSectionProgress(filters);
        return res.status(200).json(sections);
    } catch (error) {
        console.error('Error fetching section progress:', error);
        return res.status(500).json({ error: 'Failed to fetch section progress' });
    }
};

export const getOptions = async (req, res) => {
    try {
        const options = await studentService.getFilterOptions();
        return res.status(200).json(options);
    } catch (error) {
        console.error('Error fetching filter options:', error);
        return res.status(500).json({ error: 'Failed to fetch filter options' });
    }
};

export const getStudents = async (req, res) => {
    try {
        const filters = {
            batch: req.query.batch,
            branch: req.query.branch,
            section: req.query.section,
            status: req.query.status,
            search: req.query.search,
            page: req.query.page,
            limit: req.query.limit
        };
        const result = await studentService.getAdminStudentsList(filters);
        return res.status(200).json(result);
    } catch (error) {
        console.error('Error fetching admin students list:', error);
        return res.status(500).json({ error: 'Failed to fetch students list' });
    }
};

export const getStudentById = async (req, res) => {
    try {
        const { id } = req.params;
        const student = await studentService.getStudentDetailsById(id);
        if (!student) {
            return res.status(404).json({ error: 'Student record not found' });
        }
        return res.status(200).json(student);
    } catch (error) {
        console.error('Error fetching student details:', error);
        return res.status(500).json({ error: 'Failed to fetch student details' });
    }
};

export const resetStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const student = await studentService.resetStudentSubmissionStatus(id);
        if (!student) {
            return res.status(404).json({ error: 'Student record not found' });
        }
        return res.status(200).json({ message: 'Submission status reset successfully', student });
    } catch (error) {
        console.error('Error resetting student status:', error);
        return res.status(500).json({ error: 'Failed to reset student status' });
    }
};

export const login = async (req, res) => {
    try {
        const { password } = req.body;
        const expectedPassword = process.env.ADMIN_PASSWORD || 'ravisir@978';
        if (password === expectedPassword) {
            return res.status(200).json({ success: true, message: 'Authentication successful', token: 'admin-auth-valid' });
        }
        return res.status(401).json({ error: 'Invalid password. Please check and try again.' });
    } catch (error) {
        console.error('Error during admin login:', error);
        return res.status(500).json({ error: 'Server error during login' });
    }
};

export const exportCsv = async (req, res) => {
    try {
        const filters = {
            batch: req.query.batch,
            branch: req.query.branch,
            section: req.query.section,
            status: req.query.status,
            search: req.query.search
        };

        const students = await studentService.getAllStudentsForExport(filters);

        const columns = [
            { key: 'registration_number', header: 'Registration Number' },
            { key: 'student_name', header: 'Student Name' },
            { key: 'first_name', header: 'First Name' },
            { key: 'middle_name', header: 'Middle Name' },
            { key: 'last_name', header: 'Last Name' },
            { key: 'batch', header: 'Batch' },
            { key: 'branch', header: 'Branch' },
            { key: 'section', header: 'Section' },
            { key: 'submission_status', header: 'Submission Status' },
            { key: 'submitted_at', header: 'Submitted At' },
            { key: 'gender', header: 'Gender' },
            { key: 'dob', header: 'Date of Birth' },
            { key: 'student_mobile', header: 'Student Mobile' },
            { key: 'alternate_mobile', header: 'Alternate Mobile' },
            { key: 'personal_email', header: 'Personal Email' },
            { key: 'university_email', header: 'University Email' },
            { key: 'current_address', header: 'Current Address' },
            { key: 'permanent_address', header: 'Permanent Address' },
            { key: 'tenth_board', header: '10th Board' },
            { key: 'tenth_pass_year', header: '10th Pass Year' },
            { key: 'tenth_percentage', header: '10th Percentage' },
            { key: 'qualification_after_tenth', header: 'Qualification After 10th' },
            { key: 'inter_diploma_board', header: 'Inter/Diploma Board' },
            { key: 'inter_diploma_pass_year', header: 'Inter/Diploma Pass Year' },
            { key: 'inter_diploma_percentage', header: 'Inter/Diploma Percentage' },
            { key: 'btech_cgpa', header: 'Current B.Tech CGPA' },
            { key: 'btech_percentage', header: 'Current B.Tech Percentage' },
            { key: 'active_backlogs', header: 'Active Backlogs' },
            { key: 'total_backlog_history', header: 'Total Backlog History' },
            { key: 'campus_placement_interest', header: 'Campus Placement Interest' },
            { key: 'primary_career_preference', header: 'Primary Career Preference' },
            { key: 'aadhaar_status', header: 'Aadhaar Status' },
            { key: 'aadhaar_number', header: 'Aadhaar Number' },
            { key: 'pan_status', header: 'PAN Status' },
            { key: 'pan_number', header: 'PAN Number' },
            { key: 'passport_status', header: 'Passport Status' },
            { key: 'passport_number', header: 'Passport ID / Number' },
            { key: 'student_declaration', header: 'Student Declaration' }
        ];

        const csvRows = [];
        csvRows.push(columns.map(c => `"${c.header.replace(/"/g, '""')}"`).join(','));

        for (const row of students) {
            const line = columns.map(c => {
                let val = row[c.key];
                if (val === null || val === undefined) {
                    val = '';
                } else if (val instanceof Date) {
                    val = val.toISOString().split('T')[0];
                } else {
                    val = String(val);
                }
                return `"${val.replace(/"/g, '""')}"`;
            }).join(',');
            csvRows.push(line);
        }

        const csvContent = csvRows.join('\n');
        const filename = `student_master_export_${new Date().toISOString().slice(0, 10)}.csv`;

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        return res.status(200).send(csvContent);
    } catch (error) {
        console.error('Error exporting CSV:', error);
        return res.status(500).json({ error: 'Failed to export CSV' });
    }
};

// Section-wise not-submitted list: sno, regno, section
export const exportSectionList = async (req, res) => {
    try {
        const filters = {
            batch: req.query.batch,
            branch: req.query.branch,
            section: req.query.section
        };

        const students = await studentService.getSectionWiseNotSubmitted(filters);

        // Build CSV: sno, regno, section
        const csvRows = ['"S.No","Registration Number","Section"'];
        students.forEach((row, idx) => {
            csvRows.push(`"${idx + 1}","${row.registration_number}","${row.section}"`);
        });

        const csvContent = csvRows.join('\n');
        const batchLabel = filters.batch ? `_${filters.batch.replace(/[^a-zA-Z0-9]/g, '')}` : '';
        const filename = `not_submitted_section_wise${batchLabel}_${new Date().toISOString().slice(0, 10)}.csv`;

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        return res.status(200).send(csvContent);
    } catch (error) {
        console.error('Error exporting section list:', error);
        return res.status(500).json({ error: 'Failed to export section list' });
    }
};

// Export all filled/submitted student master data as Excel (.xlsx)
export const exportSubmittedExcel = async (req, res) => {
    try {
        const filters = {
            batch: req.query.batch,
            branch: req.query.branch,
            section: req.query.section,
            search: req.query.search
        };

        const students = await studentService.getSubmittedStudentsForExport(filters);

        // Build Excel worksheet with formatted data matching user specification
        const data = students.map(std => ({
            'Registration Number': std.registration_number || '',
            'Student Name': std.student_name || '',
            'First Name': std.first_name || '',
            'Middle Name': std.middle_name || '',
            'Last Name': std.last_name || '',
            'Batch': std.batch || '',
            'Branch': std.branch || '',
            'Section': std.section || '',
            'Gender': std.gender || '',
            'Date of Birth': std.dob ? new Date(std.dob).toLocaleDateString() : '',
            'Personal Email': std.personal_email || '',
            'University Email': std.university_email || '',
            'Student Mobile': std.student_mobile || '',
            'Alternate Mobile': std.alternate_mobile || '',
            'Current Address': std.current_address || '',
            'Permanent Address': std.permanent_address || '',
            '10th Board': std.tenth_board || '',
            '10th Pass Year': std.tenth_pass_year || '',
            '10th Percentage': std.tenth_percentage ? `${std.tenth_percentage}%` : '',
            'Qualification': std.qualification_after_tenth || '',
            'Board / Institute': std.inter_diploma_board || '',
            'Pass Year': std.inter_diploma_pass_year || '',
            'Percentage': std.inter_diploma_percentage ? `${std.inter_diploma_percentage}%` : '',
            'Current B.Tech CGPA': std.btech_cgpa || '',
            'B.Tech Percentage': std.btech_percentage ? `${std.btech_percentage}%` : '',
            'Active Backlogs': std.active_backlogs ?? 0,
            'Total Backlog History': std.total_backlog_history ?? 0,
            'Campus Placement Interest': std.campus_placement_interest || '',
            'Career Preference': std.primary_career_preference || '',
            'Aadhaar Status': std.aadhaar_status || '',
            'Aadhaar Number': std.aadhaar_number || '',
            'PAN Status': std.pan_status || '',
            'PAN Number': std.pan_number || '',
            'Passport Status': std.passport_status || '',
            'Passport ID / Number': std.passport_number || '',
            'Declaration': std.student_declaration || '',
            'Submitted At': std.submitted_at ? new Date(std.submitted_at).toLocaleString() : ''
        }));

        const worksheet = xlsx.utils.json_to_sheet(data);

        // Adjust column widths automatically
        const colWidths = Object.keys(data[0] || {}).map(key => ({
            wch: Math.max(key.length, 15)
        }));
        worksheet['!cols'] = colWidths;

        const workbook = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(workbook, worksheet, 'Filled_Students_Master');

        const buffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });

        const filename = `filled_students_master_${new Date().toISOString().slice(0, 10)}.xlsx`;

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        return res.status(200).send(buffer);
    } catch (error) {
        console.error('Error exporting submitted excel:', error);
        return res.status(500).json({ error: 'Failed to export submitted excel' });
    }
};

