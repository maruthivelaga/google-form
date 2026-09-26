import { query } from '../db/index.js';

export const lookupStudentByReg = async (regNo) => {
    const cleanReg = String(regNo || '').trim().toUpperCase();
    if (!cleanReg) return null;

    const res = await query(
        `SELECT id, registration_number, student_name, first_name, last_name, batch, branch, section, submission_status, submitted_at
         FROM students 
         WHERE UPPER(registration_number) = $1`,
        [cleanReg]
    );

    return res.rows[0] || null;
};

export const submitStudentForm = async (data) => {
    const cleanReg = String(data.registration_number || '').trim().toUpperCase();

    if (!cleanReg) {
        throw { status: 400, message: 'Registration number is required.' };
    }

    // Check database
    const existing = await lookupStudentByReg(cleanReg);

    if (existing && existing.submission_status === 'SUBMITTED') {
        throw {
            status: 400,
            message: 'Student already submitted.'
        };
    }

    if (existing) {
        // Update query for pre-seeded student
        const updateSql = `
            UPDATE students SET
                student_name = $1,
                first_name = $2,
                last_name = $3,
                batch = $4,
                branch = $5,
                section = $6,
                gender = $7,
                dob = $8,
                student_mobile = $9,
                alternate_mobile = $10,
                personal_email = $11,
                university_email = $12,
                tenth_board = $13,
                tenth_pass_year = $14,
                tenth_percentage = $15,
                qualification_after_tenth = $16,
                inter_diploma_board = $17,
                inter_diploma_pass_year = $18,
                inter_diploma_percentage = $19,
                btech_cgpa = $20,
                btech_percentage = $21,
                active_backlogs = $22,
                total_backlog_history = $23,
                campus_placement_interest = $24,
                primary_career_preference = $25,
                aadhaar_status = $26,
                aadhaar_number = $27,
                pan_status = $28,
                pan_number = $29,
                passport_status = $30,
                passport_number = $31,
                student_declaration = $32,
                submission_status = 'SUBMITTED',
                submitted_at = CURRENT_TIMESTAMP,
                updated_at = CURRENT_TIMESTAMP
            WHERE UPPER(registration_number) = $33
            RETURNING *;
        `;

        const params = [
            data.student_name || existing.student_name || null,
            data.first_name || null,
            data.last_name || null,
            data.batch || existing.batch,
            data.branch || existing.branch,
            data.section || existing.section,
            data.gender || null,
            data.dob || null,
            data.student_mobile || null,
            data.alternate_mobile || null,
            data.personal_email || null,
            data.university_email || null,
            data.tenth_board || null,
            data.tenth_pass_year ? parseInt(data.tenth_pass_year, 10) : null,
            data.tenth_percentage ? parseFloat(data.tenth_percentage) : null,
            data.qualification_after_tenth || null,
            data.inter_diploma_board || null,
            data.inter_diploma_pass_year ? parseInt(data.inter_diploma_pass_year, 10) : null,
            data.inter_diploma_percentage ? parseFloat(data.inter_diploma_percentage) : null,
            data.btech_cgpa ? parseFloat(data.btech_cgpa) : null,
            data.btech_percentage ? parseFloat(data.btech_percentage) : null,
            data.active_backlogs !== undefined && data.active_backlogs !== '' ? parseInt(data.active_backlogs, 10) : 0,
            data.total_backlog_history !== undefined && data.total_backlog_history !== '' ? parseInt(data.total_backlog_history, 10) : 0,
            data.campus_placement_interest || null,
            data.primary_career_preference || null,
            data.aadhaar_status || null,
            data.aadhaar_number || null,
            data.pan_status || null,
            data.pan_number || null,
            data.passport_status || null,
            data.passport_number || null,
            data.student_declaration || 'I Confirm',
            cleanReg
        ];

        const result = await query(updateSql, params);
        return result.rows[0];
    } else {
        // Insert new student record if not pre-seeded
        const insertSql = `
            INSERT INTO students (
                registration_number, student_name, first_name, last_name, batch, branch, section,
                gender, dob, student_mobile, alternate_mobile, personal_email, university_email,
                tenth_board, tenth_pass_year, tenth_percentage, qualification_after_tenth,
                inter_diploma_board, inter_diploma_pass_year, inter_diploma_percentage,
                btech_cgpa, btech_percentage, active_backlogs, total_backlog_history,
                campus_placement_interest, primary_career_preference, aadhaar_status, aadhaar_number,
                pan_status, pan_number, passport_status, passport_number, student_declaration, submission_status, submitted_at
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17,
                $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, 'SUBMITTED', CURRENT_TIMESTAMP
            )
            RETURNING *;
        `;

        const params = [
            cleanReg,
            data.student_name || null,
            data.first_name || null,
            data.last_name || null,
            data.batch || '2023-27',
            data.branch || 'CSE',
            data.section || '1',
            data.gender || null,
            data.dob || null,
            data.student_mobile || null,
            data.alternate_mobile || null,
            data.personal_email || null,
            data.university_email || null,
            data.tenth_board || null,
            data.tenth_pass_year ? parseInt(data.tenth_pass_year, 10) : null,
            data.tenth_percentage ? parseFloat(data.tenth_percentage) : null,
            data.qualification_after_tenth || null,
            data.inter_diploma_board || null,
            data.inter_diploma_pass_year ? parseInt(data.inter_diploma_pass_year, 10) : null,
            data.inter_diploma_percentage ? parseFloat(data.inter_diploma_percentage) : null,
            data.btech_cgpa ? parseFloat(data.btech_cgpa) : null,
            data.btech_percentage ? parseFloat(data.btech_percentage) : null,
            data.active_backlogs !== undefined && data.active_backlogs !== '' ? parseInt(data.active_backlogs, 10) : 0,
            data.total_backlog_history !== undefined && data.total_backlog_history !== '' ? parseInt(data.total_backlog_history, 10) : 0,
            data.campus_placement_interest || null,
            data.primary_career_preference || null,
            data.aadhaar_status || null,
            data.aadhaar_number || null,
            data.pan_status || null,
            data.pan_number || null,
            data.passport_status || null,
            data.passport_number || null,
            data.student_declaration || 'I Confirm'
        ];

        const result = await query(insertSql, params);
        return result.rows[0];
    }
};

export const getAdminStats = async (filters = {}) => {
    let whereClauses = [];
    let params = [];

    if (filters.batch) {
        params.push(filters.batch);
        whereClauses.push(`batch = $${params.length}`);
    }
    if (filters.branch) {
        params.push(filters.branch);
        whereClauses.push(`branch = $${params.length}`);
    }

    const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    const res = await query(
        `SELECT 
            COUNT(*)::int AS total,
            COUNT(CASE WHEN submission_status = 'SUBMITTED' THEN 1 END)::int AS submitted,
            COUNT(CASE WHEN submission_status != 'SUBMITTED' OR submission_status IS NULL THEN 1 END)::int AS pending,
            COUNT(CASE WHEN (submission_status != 'SUBMITTED' OR submission_status IS NULL) AND batch LIKE '2024%' THEN 1 END)::int AS second_year_pending,
            COUNT(CASE WHEN (submission_status != 'SUBMITTED' OR submission_status IS NULL) AND batch LIKE '2023%' THEN 1 END)::int AS final_year_pending,
            COUNT(CASE WHEN batch LIKE '2024%' THEN 1 END)::int AS second_year_total,
            COUNT(CASE WHEN batch LIKE '2023%' THEN 1 END)::int AS final_year_total
         FROM students ${whereSql}`,
        params
    );

    const row = res.rows[0] || { total: 0, submitted: 0, pending: 0, second_year_pending: 0, final_year_pending: 0, second_year_total: 0, final_year_total: 0 };
    const percentage = row.total > 0 ? parseFloat(((row.submitted / row.total) * 100).toFixed(1)) : 0;

    return {
        total: row.total,
        submitted: row.submitted,
        pending: row.pending,
        percentage,
        second_year_pending: row.second_year_pending,
        final_year_pending: row.final_year_pending,
        second_year_total: row.second_year_total,
        final_year_total: row.final_year_total
    };
};

export const getAdminSectionProgress = async (filters = {}) => {
    let whereClauses = [];
    let params = [];

    if (filters.batch) {
        params.push(filters.batch);
        whereClauses.push(`batch = $${params.length}`);
    }
    if (filters.branch) {
        params.push(filters.branch);
        whereClauses.push(`branch = $${params.length}`);
    }

    const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    const res = await query(
        `SELECT 
            section,
            batch,
            branch,
            COUNT(*)::int AS total,
            COUNT(CASE WHEN submission_status = 'SUBMITTED' THEN 1 END)::int AS submitted,
            COUNT(CASE WHEN submission_status != 'SUBMITTED' OR submission_status IS NULL THEN 1 END)::int AS pending
         FROM students ${whereSql}
         GROUP BY section, batch, branch
         ORDER BY batch ASC, branch ASC, section ASC`,
        params
    );

    const sortedRows = res.rows.sort((a, b) => {
        const numA = parseInt(a.section, 10);
        const numB = parseInt(b.section, 10);
        if (!isNaN(numA) && !isNaN(numB)) {
            return numA - numB;
        }
        return String(a.section).localeCompare(String(b.section));
    });

    return sortedRows.map(r => ({
        ...r,
        percentage: r.total > 0 ? parseFloat(((r.submitted / r.total) * 100).toFixed(1)) : 0
    }));
};

export const getFilterOptions = async () => {
    const batchRes = await query(`SELECT DISTINCT batch FROM students ORDER BY batch ASC`);
    const branchRes = await query(`SELECT DISTINCT branch FROM students ORDER BY branch ASC`);
    const sectionRes = await query(`SELECT DISTINCT section FROM students`);

    const sections = sectionRes.rows.map(r => r.section).sort((a, b) => {
        const numA = parseInt(a, 10);
        const numB = parseInt(b, 10);
        if (!isNaN(numA) && !isNaN(numB)) {
            return numA - numB;
        }
        return String(a).localeCompare(String(b));
    });

    return {
        batches: batchRes.rows.map(r => r.batch),
        branches: branchRes.rows.map(r => r.branch),
        sections
    };
};

export const getAdminStudentsList = async (filters = {}) => {
    const { batch, branch, section, status, search, page = 1, limit = 50 } = filters;

    let whereClauses = [];
    let params = [];

    if (batch) {
        params.push(batch);
        whereClauses.push(`batch = $${params.length}`);
    }

    if (branch) {
        params.push(branch);
        whereClauses.push(`branch = $${params.length}`);
    }

    if (section) {
        params.push(section);
        whereClauses.push(`section = $${params.length}`);
    }

    if (status && status !== 'ALL') {
        if (status === 'SUBMITTED') {
            whereClauses.push(`submission_status = 'SUBMITTED'`);
        } else if (status === 'NOT_SUBMITTED' || status === 'PENDING') {
            whereClauses.push(`(submission_status != 'SUBMITTED' OR submission_status IS NULL)`);
        }
    }

    if (search) {
        params.push(`%${search.trim().toLowerCase()}%`);
        const searchIdx = params.length;
        whereClauses.push(`(LOWER(registration_number) LIKE $${searchIdx} OR LOWER(COALESCE(student_name, '')) LIKE $${searchIdx})`);
    }

    const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    // Count total matching
    const countRes = await query(`SELECT COUNT(*)::int AS total FROM students ${whereSql}`, params);
    const totalCount = countRes.rows[0].total;

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 50;
    const offset = (pageNum - 1) * limitNum;

    params.push(limitNum);
    const limitParamIdx = params.length;
    params.push(offset);
    const offsetParamIdx = params.length;

    const querySql = `
        SELECT 
            id, registration_number, student_name, first_name, last_name, batch, branch, section,
            submission_status, submitted_at, student_mobile, personal_email, university_email,
            btech_cgpa, active_backlogs
        FROM students 
        ${whereSql}
        ORDER BY 
            submission_status DESC,
            registration_number ASC
        LIMIT $${limitParamIdx} OFFSET $${offsetParamIdx};
    `;

    const listRes = await query(querySql, params);

    return {
        students: listRes.rows,
        total: totalCount,
        page: pageNum,
        totalPages: Math.ceil(totalCount / limitNum) || 1
    };
};

export const getStudentDetailsById = async (id) => {
    const res = await query(`SELECT * FROM students WHERE id = $1`, [id]);
    return res.rows[0] || null;
};

export const resetStudentSubmissionStatus = async (id) => {
    const res = await query(
        `UPDATE students 
         SET submission_status = 'NOT_SUBMITTED', submitted_at = NULL, updated_at = CURRENT_TIMESTAMP 
         WHERE id = $1 RETURNING *`,
        [id]
    );
    return res.rows[0] || null;
};

export const getAllStudentsForExport = async (filters = {}) => {
    const { batch, branch, section, status, search } = filters;

    let whereClauses = [];
    let params = [];

    if (batch) {
        params.push(batch);
        whereClauses.push(`batch = $${params.length}`);
    }

    if (branch) {
        params.push(branch);
        whereClauses.push(`branch = $${params.length}`);
    }

    if (section) {
        params.push(section);
        whereClauses.push(`section = $${params.length}`);
    }

    if (status && status !== 'ALL') {
        if (status === 'SUBMITTED') {
            whereClauses.push(`submission_status = 'SUBMITTED'`);
        } else if (status === 'NOT_SUBMITTED' || status === 'PENDING') {
            whereClauses.push(`(submission_status != 'SUBMITTED' OR submission_status IS NULL)`);
        }
    }

    if (search) {
        params.push(`%${search.trim().toLowerCase()}%`);
        const searchIdx = params.length;
        whereClauses.push(`(LOWER(registration_number) LIKE $${searchIdx} OR LOWER(COALESCE(student_name, '')) LIKE $${searchIdx})`);
    }

    const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    const res = await query(
        `SELECT * FROM students ${whereSql} ORDER BY registration_number ASC`,
        params
    );

    return res.rows;
};

export const getSectionWiseNotSubmitted = async (filters = {}) => {
    const { batch, branch, section } = filters;

    let whereClauses = [];
    let params = [];

    // Always filter for not-submitted only
    whereClauses.push(`(submission_status != 'SUBMITTED' OR submission_status IS NULL)`);

    if (batch) {
        params.push(batch);
        whereClauses.push(`batch = $${params.length}`);
    }
    if (branch) {
        params.push(branch);
        whereClauses.push(`branch = $${params.length}`);
    }
    if (section) {
        params.push(section);
        whereClauses.push(`section = $${params.length}`);
    }

    const whereSql = `WHERE ${whereClauses.join(' AND ')}`;

    const res = await query(
        `SELECT registration_number, section, batch, branch
         FROM students ${whereSql}
         ORDER BY section ASC, registration_number ASC`,
        params
    );

    return res.rows;
};
