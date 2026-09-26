-- Database Schema for Student Master Data Collection System

CREATE TABLE IF NOT EXISTS students (
    id SERIAL PRIMARY KEY,
    registration_number VARCHAR(50) UNIQUE NOT NULL,
    student_name VARCHAR(255),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    batch VARCHAR(50) NOT NULL,
    branch VARCHAR(50) NOT NULL,
    section VARCHAR(50) NOT NULL,
    gender VARCHAR(50),
    dob DATE,
    student_mobile VARCHAR(20),
    alternate_mobile VARCHAR(20),
    personal_email VARCHAR(255),
    university_email VARCHAR(255),
    tenth_board VARCHAR(100),
    tenth_pass_year INTEGER,
    tenth_percentage NUMERIC(5,2),
    qualification_after_tenth VARCHAR(100),
    inter_diploma_board VARCHAR(100),
    inter_diploma_pass_year INTEGER,
    inter_diploma_percentage NUMERIC(5,2),
    btech_cgpa NUMERIC(4,2),
    btech_percentage NUMERIC(5,2),
    active_backlogs INTEGER DEFAULT 0,
    total_backlog_history INTEGER DEFAULT 0,
    campus_placement_interest VARCHAR(50),
    primary_career_preference VARCHAR(100),
    aadhaar_status VARCHAR(100),
    aadhaar_number VARCHAR(20),
    pan_status VARCHAR(100),
    pan_number VARCHAR(20),
    passport_status VARCHAR(100),
    passport_number VARCHAR(50),
    student_declaration VARCHAR(50),
    submission_status VARCHAR(50) NOT NULL DEFAULT 'NOT_SUBMITTED',
    submitted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_students_reg_no ON students(registration_number);
CREATE INDEX IF NOT EXISTS idx_students_batch ON students(batch);
CREATE INDEX IF NOT EXISTS idx_students_branch ON students(branch);
CREATE INDEX IF NOT EXISTS idx_students_section ON students(section);
CREATE INDEX IF NOT EXISTS idx_students_submission_status ON students(submission_status);
