import path from 'path';
import fs from 'fs';
import xlsx from 'xlsx';
import { fileURLToPath } from 'url';
import { pool, initSchema } from '../src/db/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function seedStudents() {
    console.log('\nStudent Master Seed');
    console.log('──────────────────────────────\n');

    try {
        await initSchema();

        const dataDir = path.resolve(__dirname, '../../data');
        let totalRows = 0;
        let inserted = 0;
        let skipped = 0;
        let duplicates = 0;
        let invalidRows = 0;

        const seenRegs = new Set();
        const existingRes = await pool.query('SELECT registration_number FROM students');
        const existingInDb = new Set(existingRes.rows.map(r => r.registration_number.toUpperCase()));

        // File 1: councellors.xlsx
        const councellorsPath = path.join(dataDir, 'councellors.xlsx');
        if (fs.existsSync(councellorsPath)) {
            const wb = xlsx.readFile(councellorsPath);
            for (const sheetName of wb.SheetNames) {
                const sheet = wb.Sheets[sheetName];
                const rows = xlsx.utils.sheet_to_json(sheet, { defval: null });

                // Infer batch from sheet name or reg numbers
                let batch = '2023-27';
                if (sheetName === 'III' || sheetName.includes('2024') || sheetName === '3') {
                    batch = '2024-28';
                }

                for (const row of rows) {
                    totalRows++;
                    const rawReg = row['Registerno'] || row['Registration Number'] || row['Reg No'] || row['registerno'];
                    const rawSec = row['Section'] || row['section'];

                    if (!rawReg) {
                        invalidRows++;
                        continue;
                    }

                    const regNo = String(rawReg).trim().toUpperCase();
                    if (!regNo || regNo.length < 3) {
                        invalidRows++;
                        continue;
                    }

                    // Infer batch dynamically from reg prefix if possible
                    let rowBatch = batch;
                    if (regNo.startsWith('24') || regNo.startsWith('25')) {
                        rowBatch = '2024-28';
                    } else if (regNo.startsWith('23') || regNo.startsWith('22')) {
                        rowBatch = '2023-27';
                    }

                    let sectionStr = '1';
                    if (rawSec !== null && rawSec !== undefined) {
                        sectionStr = String(rawSec).replace(/\.0$/, '').trim();
                    }

                    const branch = 'CSE'; // Standard branch for these registration series (04)

                    if (seenRegs.has(regNo)) {
                        duplicates++;
                        skipped++;
                        continue;
                    }
                    seenRegs.add(regNo);

                    if (existingInDb.has(regNo)) {
                        skipped++;
                        continue;
                    }

                    // Insert into database
                    await pool.query(
                        `INSERT INTO students (registration_number, batch, branch, section, submission_status)
                         VALUES ($1, $2, $3, $4, 'NOT_SUBMITTED')
                         ON CONFLICT (registration_number) DO NOTHING`,
                        [regNo, rowBatch, branch, sectionStr]
                    );

                    inserted++;
                    existingInDb.add(regNo);
                }
            }
        }

        // File 2: Student_Master_Data_Collection_Template.xlsx / student_master.xlsx
        const templatePath = path.join(dataDir, 'Student_Master_Data_Collection_Template.xlsx');
        if (fs.existsSync(templatePath)) {
            const wb = xlsx.readFile(templatePath);
            const sheet = wb.Sheets['Student_Data'] || wb.Sheets[wb.SheetNames[0]];
            if (sheet) {
                const rows = xlsx.utils.sheet_to_json(sheet, { header: 1 });
                // Skip title row and header row if needed
                for (let r = 2; r < rows.length; r++) {
                    const row = rows[r];
                    if (!row || !row[0]) continue;
                    totalRows++;
                    const regNo = String(row[0]).trim().toUpperCase();
                    if (!regNo || regNo === 'REGISTRATION NUMBER') continue;

                    const studentName = row[1] ? String(row[1]).trim() : null;
                    const firstName = row[2] ? String(row[2]).trim() : null;
                    const lastName = row[3] ? String(row[3]).trim() : null;
                    const batch = row[4] ? String(row[4]).trim() : '2023-27';
                    const branch = row[5] ? String(row[5]).trim() : 'CSE';
                    const section = row[6] ? String(row[6]).replace(/\.0$/, '').trim() : '1';

                    if (seenRegs.has(regNo)) {
                        duplicates++;
                        skipped++;
                        continue;
                    }
                    seenRegs.add(regNo);

                    if (existingInDb.has(regNo)) {
                        // Update details if missing
                        await pool.query(
                            `UPDATE students 
                             SET student_name = COALESCE(student_name, $1),
                                 first_name = COALESCE(first_name, $2),
                                 last_name = COALESCE(last_name, $3)
                             WHERE registration_number = $4`,
                            [studentName, firstName, lastName, regNo]
                        );
                        skipped++;
                        continue;
                    }

                    await pool.query(
                        `INSERT INTO students (registration_number, student_name, first_name, last_name, batch, branch, section, submission_status)
                         VALUES ($1, $2, $3, $4, $5, $6, $7, 'NOT_SUBMITTED')
                         ON CONFLICT (registration_number) DO NOTHING`,
                        [regNo, studentName, firstName, lastName, batch, branch, section]
                    );

                    inserted++;
                    existingInDb.add(regNo);
                }
            }
        }

        console.log(`Total rows:       ${totalRows}`);
        console.log(`Inserted:         ${inserted}`);
        console.log(`Skipped:          ${skipped}`);
        console.log(`Duplicates:       ${duplicates}`);
        console.log(`Invalid rows:     ${invalidRows}\n`);
        console.log('Seed completed successfully.\n');
    } catch (error) {
        console.error('Error seeding student master data:', error);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

seedStudents();
