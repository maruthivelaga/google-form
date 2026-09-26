# Student Master Data Collection System

A lightweight, self-hosted web application for collecting and managing student master data, designed as a dedicated alternative to Google Forms for university workflows.

## Technology Stack

- **Frontend**: React, Vite, JavaScript, Pure CSS (No Tailwind CSS)
- **Backend**: Node.js, Express.js, REST API
- **Database**: PostgreSQL (`pg` / node-postgres with parameterized SQL queries)
- **Data Source**: Excel files in `data/` (`councellors.xlsx`, `Student_Master_Data_Collection_Template.xlsx`)

---

## Features

### 1. Student Flow (`/`)
- Direct form access without login/authentication.
- Pre-seeded registration number lookup and auto-fill for Batch, Branch, and Section.
- 9 Form Sections:
  1. Personal / Identity Information
  2. Contact Information
  3. 10th / SSC Information
  4. Intermediate / Diploma Information
  5. B.Tech Information & Backlog History
  6. Career Information & Preferences
  7. Document Status (Aadhaar, PAN, Passport status only)
  8. Confirmation & Declaration
- Full frontend and backend validation.
- Duplicate submission prevention per registration number.
- Clean success screen upon submission.

### 2. Administrator Dashboard (`/ravikishoretp`)
- **Key Statistics Cards**: Total Students, Submitted Count, Pending Count, and Submission Percentage with progress bar.
- **Section-Wise Progress Tracking**: Visual breakdown of total, submitted, pending, and percentage by section. Clicking a section filters the student table.
- **Multi-Filter Toolbar**: Batch, Branch, Section, Submission Status (All, Submitted, Pending), and Search by Registration Number or Name.
- **Student Data Table**: Interactive table with status badges (`✓ Submitted` / `● Pending`), view details modal trigger, and submission status reset button.
- **Student Details Modal**: Complete view of all 9 submitted form sections.
- **CSV Export**: Filter-aware CSV export functionality (`/api/admin/export`).

---

## Project Structure

```text
.
├── data/
│   ├── councellors.xlsx
│   ├── Student_Master_Data_Collection_Template.xlsx
│   ├── main_data_schema.xlsx
│   └── student_master.xlsx
├── database/
│   └── schema.sql
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── adminController.js
│   │   │   └── studentController.js
│   │   ├── db/
│   │   │   └── index.js
│   │   ├── routes/
│   │   │   ├── adminRoutes.js
│   │   │   └── studentRoutes.js
│   │   ├── services/
│   │   │   └── studentService.js
│   │   └── server.js
│   └── scripts/
│       └── seedStudents.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── SectionCard.jsx
│   │   │   ├── StepIndicator.jsx
│   │   │   ├── StudentDetailsModal.jsx
│   │   │   └── StudentForm.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   └── vite.config.js
├── .env.example
├── package.json
└── README.md
```

---

## Getting Started

### 1. Prerequisites
- Node.js (v18+)
- PostgreSQL installed and running locally

### 2. Database & Environment Setup
Create a PostgreSQL database named `student_master`:

```sql
CREATE DATABASE student_master;
```

Copy `.env.example` to `.env` and adjust database credentials:

```env
PORT=5000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/student_master
PGHOST=localhost
PGPORT=5432
PGDATABASE=student_master
PGUSER=postgres
PGPASSWORD=postgres
```

### 3. Install Dependencies & Seed Database
Run the idempotent seed script to populate master registration records from Excel files:

```bash
# Install root dependencies
npm install

# Seed student master data from Excel files
npm run seed
```

Expected output:
```text
Student Master Seed
──────────────────────────────

Total rows:       2848
Inserted:         2848
Skipped:          0
Duplicates:       0
Invalid rows:     0

Seed completed successfully.
```

### 4. Running the Application
Start both Express backend and Vite frontend concurrently:

```bash
npm run dev
```

- **Student Form**: `http://localhost:3000/`
- **Admin Dashboard**: `http://localhost:3000/ravikishoretp`
- **Backend REST API**: `http://localhost:5000/api`
