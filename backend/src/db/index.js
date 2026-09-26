import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import xlsx from 'xlsx';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const { Pool } = pg;

const createPoolConfig = () => {
    if (process.env.DATABASE_URL) {
        return { connectionString: process.env.DATABASE_URL };
    }
    return {
        host: process.env.PGHOST || '127.0.0.1',
        port: process.env.PGPORT ? parseInt(process.env.PGPORT, 10) : 5432,
        user: process.env.PGUSER || 'postgres',
        password: process.env.PGPASSWORD || '',
        database: process.env.PGDATABASE || 'student_master'
    };
};

export const pool = new Pool(createPoolConfig());

export const query = async (text, params) => {
    return pool.query(text, params);
};

export const initSchema = async () => {
    // Try multiple possible schema paths (local dev vs Docker container layout)
    const possiblePaths = [
        path.resolve(__dirname, '../../../database/schema.sql'),  // local dev
        path.resolve(__dirname, '../../database/schema.sql'),     // Docker (WORKDIR /app)
        path.resolve(process.cwd(), 'database/schema.sql')
    ];

    let sql = '';
    for (const schemaPath of possiblePaths) {
        if (fs.existsSync(schemaPath)) {
            sql = fs.readFileSync(schemaPath, 'utf-8');
            break;
        }
    }

    if (!sql) {
        throw new Error('schema.sql not found. Searched: ' + possiblePaths.join(', '));
    }

    await pool.query(sql);
    console.log('✓ Database schema verified/initialized.');
};

// Auto-seed: reads Excel files from data/ and inserts students if the table is empty
export const autoSeedIfEmpty = async () => {
    const countRes = await pool.query('SELECT COUNT(*)::int AS cnt FROM students');
    const count = countRes.rows[0].cnt;

    if (count > 0) {
        console.log(`✓ Students table already has ${count} records. Skipping seed.`);
        return;
    }

    console.log('⏳ Students table is empty. Running auto-seed from Excel files...');

    // Try multiple possible data directories
    const possibleDataDirs = [
        path.resolve(__dirname, '../../../data'),   // local dev
        path.resolve(__dirname, '../../data'),      // Docker
        path.resolve(process.cwd(), 'data')
    ];

    let dataDir = null;
    for (const d of possibleDataDirs) {
        if (fs.existsSync(d)) {
            dataDir = d;
            break;
        }
    }

    if (!dataDir) {
        console.warn('⚠ data/ directory not found. Seed skipped.');
        return;
    }

    let inserted = 0;
    let skipped = 0;
    const seenRegs = new Set();

    // Helper: insert one student row
    const insertStudent = async (regNo, batch, branch, section, name, firstName, lastName) => {
        if (seenRegs.has(regNo)) return;
        seenRegs.add(regNo);
        await pool.query(
            `INSERT INTO students (registration_number, student_name, first_name, last_name, batch, branch, section, submission_status)
             VALUES ($1, $2, $3, $4, $5, $6, $7, 'NOT_SUBMITTED')
             ON CONFLICT (registration_number) DO NOTHING`,
            [regNo, name || null, firstName || null, lastName || null, batch, branch, section]
        );
        inserted++;
    };

    // File 1: councellors.xlsx (registration number lists by section)
    const councellorsPath = path.join(dataDir, 'councellors.xlsx');
    if (fs.existsSync(councellorsPath)) {
        const wb = xlsx.readFile(councellorsPath);
        for (const sheetName of wb.SheetNames) {
            const sheet = wb.Sheets[sheetName];
            const rows = xlsx.utils.sheet_to_json(sheet, { defval: null });

            for (const row of rows) {
                const rawReg = row['Registerno'] || row['Registration Number'] || row['Reg No'] || row['registerno'];
                const rawSec = row['Section'] || row['section'];
                if (!rawReg) { skipped++; continue; }

                const regNo = String(rawReg).trim().toUpperCase();
                if (!regNo || regNo.length < 3) { skipped++; continue; }

                // Infer batch from reg number prefix
                let batch = '2023-27';
                if (regNo.startsWith('24') || regNo.startsWith('25')) batch = '2024-28';
                else if (regNo.startsWith('23') || regNo.startsWith('22')) batch = '2023-27';

                const section = rawSec !== null && rawSec !== undefined
                    ? String(rawSec).replace(/\.0$/, '').trim()
                    : '1';

                await insertStudent(regNo, batch, 'CSE', section, null, null, null);
            }
        }
    }

    // File 2: Student_Master_Data_Collection_Template.xlsx (full student details)
    const templatePath = path.join(dataDir, 'Student_Master_Data_Collection_Template.xlsx');
    if (fs.existsSync(templatePath)) {
        const wb = xlsx.readFile(templatePath);
        const sheet = wb.Sheets['Student_Data'] || wb.Sheets[wb.SheetNames[0]];
        if (sheet) {
            const rows = xlsx.utils.sheet_to_json(sheet, { header: 1 });
            for (let r = 2; r < rows.length; r++) {
                const row = rows[r];
                if (!row || !row[0]) continue;
                const regNo = String(row[0]).trim().toUpperCase();
                if (!regNo || regNo === 'REGISTRATION NUMBER') continue;

                const name = row[1] ? String(row[1]).trim() : null;
                const firstName = row[2] ? String(row[2]).trim() : null;
                const lastName = row[3] ? String(row[3]).trim() : null;
                const batch = row[4] ? String(row[4]).trim() : '2023-27';
                const branch = row[5] ? String(row[5]).trim() : 'CSE';
                const section = row[6] ? String(row[6]).replace(/\.0$/, '').trim() : '1';

                await insertStudent(regNo, batch, branch, section, name, firstName, lastName);
            }
        }
    }

    console.log(`✓ Auto-seed complete: ${inserted} students inserted, ${skipped} rows skipped.`);
};

export default { pool, query, initSchema, autoSeedIfEmpty };
