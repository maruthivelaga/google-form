import React, { useState } from 'react';
import { submitStudentForm } from '../services/api';
import StepIndicator from './StepIndicator';
import {
    User,
    Phone,
    BookOpen,
    Award,
    Briefcase,
    FileText,
    CheckCircle2,
    AlertCircle,
    ArrowRight,
    ArrowLeft,
    Check
} from 'lucide-react';

const STORAGE_KEY_DATA = 'student_form_data_v1';
const STORAGE_KEY_STEP = 'student_form_step_v1';

const INITIAL_FORM_STATE = {
    registration_number: '',
    student_name: '',
    first_name: '',
    middle_name: '',
    last_name: '',
    batch: '2023-27',
    branch: 'CSE',
    section: '',
    gender: 'Male',
    dob: '',
    student_mobile: '',
    alternate_mobile: '',
    personal_email: '',
    university_email: '',
    current_address: '',
    permanent_address: '',
    tenth_board: 'SSC',
    tenth_pass_year: '',
    tenth_percentage: '',
    qualification_after_tenth: 'Intermediate / 12th',
    inter_diploma_board: 'BIEAP',
    inter_diploma_pass_year: '',
    inter_diploma_percentage: '',
    btech_cgpa: '',
    btech_percentage: '',
    active_backlogs: '0',
    total_backlog_history: '0',
    campus_placement_interest: 'Yes',
    primary_career_preference: 'Campus Placements',
    aadhaar_status: 'Available and Updated',
    aadhaar_number: '',
    pan_status: 'Available',
    pan_number: '',
    passport_status: 'Not Available',
    passport_number: '',
    student_declaration: false
};

const STEPS = [
    { id: 1, title: 'Identity' },
    { id: 2, title: 'Contact' },
    { id: 3, title: '10th / SSC' },
    { id: 4, title: 'Inter / Diploma' },
    { id: 5, title: 'B.Tech & Backlogs' },
    { id: 6, title: 'Career & Docs' },
    { id: 7, title: 'Declaration' }
];

export default function StudentForm() {
    const [currentStep, setCurrentStep] = React.useState(() => {
        const savedStep = localStorage.getItem(STORAGE_KEY_STEP);
        return savedStep ? parseInt(savedStep, 10) : 1;
    });

    const [formData, setFormData] = React.useState(() => {
        const savedData = localStorage.getItem(STORAGE_KEY_DATA);
        if (savedData) {
            try {
                return JSON.parse(savedData);
            } catch (e) {
                return INITIAL_FORM_STATE;
            }
        }
        return INITIAL_FORM_STATE;
    });

    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submitError, setSubmitError] = useState('');

    React.useEffect(() => {
        localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(formData));
    }, [formData]);

    React.useEffect(() => {
        localStorage.setItem(STORAGE_KEY_STEP, currentStep.toString());
    }, [currentStep]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        let val = type === 'checkbox' ? checked : value;

        if (name === 'student_name' || name === 'first_name' || name === 'middle_name' || name === 'last_name' || name === 'registration_number' || name === 'pan_number' || name === 'passport_number') {
            val = String(val).toUpperCase();
        } else if (name === 'student_mobile' || name === 'alternate_mobile') {
            val = String(val).replace(/\D/g, '').slice(0, 10);
        } else if (name === 'aadhaar_number') {
            val = String(val).replace(/\D/g, '').slice(0, 12);
        }

        setFormData(prev => ({
            ...prev,
            [name]: val
        }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateStep = (step) => {
        const newErrors = {};

        if (step === 1) {
            if (!formData.registration_number.trim()) newErrors.registration_number = 'Registration Number is required';
            if (!formData.student_name.trim()) newErrors.student_name = 'Student Name as per University Records is required';
            if (!formData.first_name.trim()) newErrors.first_name = 'First Name as per official records is required';
            if (!formData.last_name.trim()) newErrors.last_name = 'Last Name as per official records is required';
            if (!formData.batch) newErrors.batch = 'Batch is required';
            if (!formData.branch) newErrors.branch = 'Branch is required';
            if (!formData.section) newErrors.section = 'Section is required';
            if (!formData.gender) newErrors.gender = 'Gender is required';
            if (!formData.dob) newErrors.dob = 'Date of Birth is required';
        }

        if (step === 2) {
            if (!formData.student_mobile.trim()) {
                newErrors.student_mobile = 'Student Mobile Number is required';
            } else if (!/^\d{10}$/.test(formData.student_mobile.trim())) {
                newErrors.student_mobile = 'Enter a valid 10-digit mobile number';
            }

            if (!formData.alternate_mobile.trim()) {
                newErrors.alternate_mobile = 'Alternate Mobile Number is required';
            } else if (!/^\d{10}$/.test(formData.alternate_mobile.trim())) {
                newErrors.alternate_mobile = 'Enter a valid 10-digit mobile number';
            }

            if (!formData.personal_email.trim()) {
                newErrors.personal_email = 'Personal Email ID is required';
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.personal_email.trim())) {
                newErrors.personal_email = 'Enter a valid email address';
            }

            if (!formData.university_email.trim()) {
                newErrors.university_email = 'University Email ID is required';
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.university_email.trim())) {
                newErrors.university_email = 'Enter a valid email address';
            }

            if (formData.personal_email.trim() && formData.university_email.trim() &&
                formData.personal_email.trim().toLowerCase() === formData.university_email.trim().toLowerCase()) {
                newErrors.university_email = 'Personal Email ID and University Email ID cannot be the same';
            }

            if (!formData.current_address.trim()) {
                newErrors.current_address = 'Current Address is required';
            }

            if (!formData.permanent_address.trim()) {
                newErrors.permanent_address = 'Permanent Address is required';
            }
        }

        if (step === 3) {
            if (!formData.tenth_board.trim()) newErrors.tenth_board = '10th Board name is required';
            if (!formData.tenth_pass_year) newErrors.tenth_pass_year = '10th Year of Passing is required';
            const pct = parseFloat(formData.tenth_percentage);
            if (isNaN(pct) || pct < 0 || pct > 100) {
                newErrors.tenth_percentage = 'Percentage must be between 0 and 100';
            }
        }

        if (step === 4) {
            if (!formData.qualification_after_tenth) newErrors.qualification_after_tenth = 'Qualification is required';
            if (!formData.inter_diploma_board.trim()) newErrors.inter_diploma_board = 'Board / Board name is required';
            if (!formData.inter_diploma_pass_year) newErrors.inter_diploma_pass_year = 'Year of Passing is required';
            const pct = parseFloat(formData.inter_diploma_percentage);
            if (isNaN(pct) || pct < 0 || pct > 100) {
                newErrors.inter_diploma_percentage = 'Percentage must be between 0 and 100';
            }
        }

        if (step === 5) {
            const cgpa = parseFloat(formData.btech_cgpa);
            if (isNaN(cgpa) || cgpa < 0 || cgpa > 10) {
                newErrors.btech_cgpa = 'CGPA must be between 0.00 and 10.00';
            }

            if (!formData.btech_percentage || formData.btech_percentage === '') {
                newErrors.btech_percentage = 'Current B.Tech Percentage is required';
            } else {
                const pct = parseFloat(formData.btech_percentage);
                if (isNaN(pct) || pct < 0 || pct > 100) {
                    newErrors.btech_percentage = 'Percentage must be between 0 and 100';
                }
            }

            if (formData.active_backlogs === '' || parseInt(formData.active_backlogs, 10) < 0) {
                newErrors.active_backlogs = 'Enter valid backlog count (0 or higher)';
            }

            if (formData.total_backlog_history === '' || parseInt(formData.total_backlog_history, 10) < 0) {
                newErrors.total_backlog_history = 'Enter valid total history of backlogs';
            }
        }

        if (step === 6) {
            if (!formData.campus_placement_interest) newErrors.campus_placement_interest = 'Please select placement interest';
            if (!formData.primary_career_preference) newErrors.primary_career_preference = 'Please select career preference';
            if (!formData.aadhaar_status) newErrors.aadhaar_status = 'Select Aadhaar status';
            if (!formData.pan_status) newErrors.pan_status = 'Select PAN status';
            if (!formData.passport_status) newErrors.passport_status = 'Select Passport status';

            if (!formData.aadhaar_number.trim()) {
                newErrors.aadhaar_number = 'Aadhaar Number is required';
            } else if (!/^\d{12}$/.test(formData.aadhaar_number.trim())) {
                newErrors.aadhaar_number = 'Aadhaar Number must be exactly 12 digits';
            }

            if (formData.pan_status === 'Available') {
                if (!formData.pan_number.trim()) {
                    newErrors.pan_number = 'PAN Number is required when PAN Status is Available';
                } else if (!/^[A-Z0-9]{10}$/i.test(formData.pan_number.trim())) {
                    newErrors.pan_number = 'PAN Number must be 10 characters';
                }
            }

            if (formData.passport_status === 'Available') {
                if (!formData.passport_number.trim()) {
                    newErrors.passport_number = 'Passport Number is required when Passport Status is Available';
                }
            }
        }

        if (step === 7) {
            if (!formData.student_declaration) {
                newErrors.student_declaration = 'You must confirm the declaration before submitting';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
        }
    };

    const handleBack = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError('');

        // Validate all steps
        let isValid = true;
        for (let s = 1; s <= 7; s++) {
            if (!validateStep(s)) {
                isValid = false;
                setCurrentStep(s);
                break;
            }
        }

        if (!isValid) return;

        setSubmitting(true);
        try {
            await submitStudentForm({
                ...formData,
                registration_number: (formData.registration_number || '').trim().toUpperCase(),
                student_declaration: 'I Confirm'
            });
            localStorage.removeItem(STORAGE_KEY_DATA);
            localStorage.removeItem(STORAGE_KEY_STEP);
            setSubmitSuccess(true);
        } catch (err) {
            setSubmitError(err.message || 'Failed to submit form. Please check your data.');
        } finally {
            setSubmitting(false);
        }
    };

    if (submitSuccess) {
        return (
            <div className="card" style={{ maxWidth: '600px', margin: '3rem auto', textAlign: 'center', padding: '3rem 2rem' }}>
                <div style={{
                    width: '70px',
                    height: '70px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--green-light)',
                    color: 'var(--green)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem'
                }}>
                    <CheckCircle2 size={42} />
                </div>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-main)' }}>
                    Submission Successful!
                </h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                    Thank you. Your student master information has been verified and updated successfully.
                </p>
                <div style={{
                    background: '#F8FAFC',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '1rem',
                    marginBottom: '2rem'
                }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block' }}>
                        REGISTRATION NUMBER
                    </span>
                    <strong style={{ fontSize: '1.4rem', color: 'var(--primary)', letterSpacing: '0.05em' }}>
                        {(formData.registration_number || '').toUpperCase()}
                    </strong>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={() => {
                        localStorage.removeItem(STORAGE_KEY_DATA);
                        localStorage.removeItem(STORAGE_KEY_STEP);
                        setSubmitSuccess(false);
                        setFormData(INITIAL_FORM_STATE);
                        setCurrentStep(1);
                    }}
                >
                    Submit Another Student
                </button>
            </div>
        );
    }

    return (
        <div>
            {/* Header Title Banner */}
            <div className="card" style={{ background: 'linear-gradient(135deg, #6C63FF 0%, #8B5CF6 100%)', color: 'white', padding: '2rem' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                    ✦ Student Master Data Form
                </h1>
                <p style={{ opacity: 0.9, fontSize: '0.95rem' }}>
                    Official data collection portal for academic records, contact info, and career preferences. Please ensure all details match university records.
                </p>
            </div>

            {/* Wizard Step Indicator */}
            <StepIndicator currentStep={currentStep} setStep={setCurrentStep} steps={STEPS} />

            {/* Main Form Container */}
            <form onSubmit={handleSubmit}>

                {/* STEP 1: Identity & Personal Information */}
                {currentStep === 1 && (
                    <div className="card">
                        <div className="card-title">
                            <User size={22} />
                            <span>1. Personal / Identity Information</span>
                        </div>

                        <div className="form-grid">
                            <div className="form-group full-width">
                                <label className="form-label">
                                    Registration Number <span className="required">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="registration_number"
                                    className="form-control"
                                    placeholder="e.g. 231FA04001 or 241FA04035"
                                    value={formData.registration_number}
                                    onChange={handleChange}
                                    style={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}
                                />
                                {errors.registration_number && <div className="form-error">{errors.registration_number}</div>}
                            </div>

                            <div className="form-group full-width">
                                <label className="form-label">
                                    Student Name as per University Records <span className="required">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="student_name"
                                    className="form-control"
                                    placeholder="Enter full name exactly as per official record"
                                    value={formData.student_name}
                                    onChange={handleChange}
                                    style={{ textTransform: 'uppercase', fontWeight: 500 }}
                                />
                                {errors.student_name && <div className="form-error">{errors.student_name}</div>}
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    First Name as per official records <span className="required">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="first_name"
                                    className="form-control"
                                    placeholder="First Name"
                                    value={formData.first_name}
                                    onChange={handleChange}
                                    style={{ textTransform: 'uppercase' }}
                                />
                                {errors.first_name && <div className="form-error">{errors.first_name}</div>}
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    Middle Name as per official records
                                </label>
                                <input
                                    type="text"
                                    name="middle_name"
                                    className="form-control"
                                    placeholder="Middle Name (if any)"
                                    value={formData.middle_name}
                                    onChange={handleChange}
                                    style={{ textTransform: 'uppercase' }}
                                />
                                {errors.middle_name && <div className="form-error">{errors.middle_name}</div>}
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    Last Name as per official records <span className="required">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="last_name"
                                    className="form-control"
                                    placeholder="Last Name / Surname"
                                    value={formData.last_name}
                                    onChange={handleChange}
                                    style={{ textTransform: 'uppercase' }}
                                />
                                {errors.last_name && <div className="form-error">{errors.last_name}</div>}
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    Batch <span className="required">*</span>
                                </label>
                                <select
                                    name="batch"
                                    className="form-control"
                                    value={formData.batch}
                                    onChange={handleChange}
                                >
                                    <option value="2023-27">2023-27</option>
                                    <option value="2024-28">2024-28</option>
                                </select>
                                {errors.batch && <div className="form-error">{errors.batch}</div>}
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    Branch <span className="required">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="branch"
                                    className="form-control"
                                    placeholder="e.g. CSE"
                                    value={formData.branch}
                                    onChange={handleChange}
                                />
                                {errors.branch && <div className="form-error">{errors.branch}</div>}
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    Section <span className="required">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="section"
                                    className="form-control"
                                    placeholder="e.g. 1, 2"
                                    value={formData.section}
                                    onChange={handleChange}
                                    style={{ textTransform: 'uppercase' }}
                                />
                                {errors.section && <div className="form-error">{errors.section}</div>}
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    Gender <span className="required">*</span>
                                </label>
                                <select
                                    name="gender"
                                    className="form-control"
                                    value={formData.gender}
                                    onChange={handleChange}
                                >
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                    <option value="Prefer not to say">Prefer not to say</option>
                                </select>
                                {errors.gender && <div className="form-error">{errors.gender}</div>}
                            </div>

                            <div className="form-group full-width">
                                <label className="form-label">
                                    Date of Birth <span className="required">*</span>
                                </label>
                                <input
                                    type="date"
                                    name="dob"
                                    className="form-control"
                                    value={formData.dob}
                                    onChange={handleChange}
                                />
                                {errors.dob && <div className="form-error">{errors.dob}</div>}
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 2: Contact Information & Address */}
                {currentStep === 2 && (
                    <div className="card">
                        <div className="card-title">
                            <Phone size={22} />
                            <span>2. Contact Information & Address</span>
                        </div>

                        <div className="form-grid">
                            <div className="form-group">
                                <label className="form-label">
                                    Personal Email ID <span className="required">*</span>
                                </label>
                                <input
                                    type="email"
                                    name="personal_email"
                                    className="form-control"
                                    placeholder=""
                                    value={formData.personal_email}
                                    onChange={handleChange}
                                />
                                {errors.personal_email && <div className="form-error">{errors.personal_email}</div>}
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    University Email ID <span className="required">*</span>
                                </label>
                                <input
                                    type="email"
                                    name="university_email"
                                    className="form-control"
                                    placeholder="e.g. 241fa04035@gmail.com"
                                    value={formData.university_email}
                                    onChange={handleChange}
                                />
                                {errors.university_email && <div className="form-error">{errors.university_email}</div>}
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    Student Mobile Number <span className="required">*</span>
                                </label>
                                <input
                                    type="tel"
                                    name="student_mobile"
                                    className="form-control"
                                    placeholder="10-digit mobile number"
                                    value={formData.student_mobile}
                                    onChange={handleChange}
                                    maxLength={10}
                                />
                                {errors.student_mobile && <div className="form-error">{errors.student_mobile}</div>}
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    Alternate Mobile Number <span className="required">*</span>
                                </label>
                                <input
                                    type="tel"
                                    name="alternate_mobile"
                                    className="form-control"
                                    placeholder="10-digit alternate number"
                                    value={formData.alternate_mobile}
                                    onChange={handleChange}
                                    maxLength={10}
                                />
                                {errors.alternate_mobile && <div className="form-error">{errors.alternate_mobile}</div>}
                            </div>

                            <div className="form-group full-width">
                                <label className="form-label">
                                    Current Address <span className="required">*</span>
                                </label>
                                <textarea
                                    name="current_address"
                                    className="form-control"
                                    rows={3}
                                    placeholder="Enter your complete current residential address"
                                    value={formData.current_address}
                                    onChange={handleChange}
                                />
                                {errors.current_address && <div className="form-error">{errors.current_address}</div>}
                            </div>

                            <div className="form-group full-width">
                                <label className="form-label">
                                    Permanent Address <span className="required">*</span>
                                </label>
                                <textarea
                                    name="permanent_address"
                                    className="form-control"
                                    rows={3}
                                    placeholder="Enter your complete permanent home address"
                                    value={formData.permanent_address}
                                    onChange={handleChange}
                                />
                                {errors.permanent_address && <div className="form-error">{errors.permanent_address}</div>}
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 3: 10th / SSC Information */}
                {currentStep === 3 && (
                    <div className="card">
                        <div className="card-title">
                            <BookOpen size={22} />
                            <span>3. 10th / SSC Information</span>
                        </div>

                        <div className="form-grid">
                            <div className="form-group full-width">
                                <label className="form-label">
                                    10th Board <span className="required">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="tenth_board"
                                    className="form-control"
                                    placeholder="e.g. SSC, CBSE, ICSE, State Board"
                                    value={formData.tenth_board}
                                    onChange={handleChange}
                                />
                                {errors.tenth_board && <div className="form-error">{errors.tenth_board}</div>}
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    10th Year of Passing <span className="required">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="tenth_pass_year"
                                    className="form-control"
                                    placeholder="e.g. 2020"
                                    value={formData.tenth_pass_year}
                                    onChange={handleChange}
                                />
                                {errors.tenth_pass_year && <div className="form-error">{errors.tenth_pass_year}</div>}
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    10th Percentage (0-100) <span className="required">*</span>
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    name="tenth_percentage"
                                    className="form-control"
                                    placeholder="e.g. 92.50"
                                    value={formData.tenth_percentage}
                                    onChange={handleChange}
                                />
                                {errors.tenth_percentage && <div className="form-error">{errors.tenth_percentage}</div>}
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 4: Intermediate / Diploma Information */}
                {currentStep === 4 && (
                    <div className="card">
                        <div className="card-title">
                            <Award size={22} />
                            <span>4. Intermediate / Diploma Information</span>
                        </div>

                        <div className="form-grid">
                            <div className="form-group full-width">
                                <label className="form-label">
                                    Qualification after 10th <span className="required">*</span>
                                </label>
                                <select
                                    name="qualification_after_tenth"
                                    className="form-control"
                                    value={formData.qualification_after_tenth}
                                    onChange={handleChange}
                                >
                                    <option value="Intermediate / 12th">Intermediate / 12th</option>
                                    <option value="Diploma">Diploma</option>
                                </select>
                                {errors.qualification_after_tenth && <div className="form-error">{errors.qualification_after_tenth}</div>}
                            </div>

                            <div className="form-group full-width">
                                <label className="form-label">
                                    Intermediate / Diploma Board <span className="required">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="inter_diploma_board"
                                    className="form-control"
                                    placeholder="e.g. BIEAP, TSBIE, CBSE, SBTET"
                                    value={formData.inter_diploma_board}
                                    onChange={handleChange}
                                />
                                {errors.inter_diploma_board && <div className="form-error">{errors.inter_diploma_board}</div>}
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    Year of Passing <span className="required">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="inter_diploma_pass_year"
                                    className="form-control"
                                    placeholder=""
                                    value={formData.inter_diploma_pass_year}
                                    onChange={handleChange}
                                />
                                {errors.inter_diploma_pass_year && <div className="form-error">{errors.inter_diploma_pass_year}</div>}
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    Percentage (0-100) <span className="required">*</span>
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    name="inter_diploma_percentage"
                                    className="form-control"
                                    placeholder="e.g. 94.00"
                                    value={formData.inter_diploma_percentage}
                                    onChange={handleChange}
                                />
                                {errors.inter_diploma_percentage && <div className="form-error">{errors.inter_diploma_percentage}</div>}
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 5: B.Tech & Backlog Information */}
                {currentStep === 5 && (
                    <div className="card">
                        <div className="card-title">
                            <BookOpen size={22} />
                            <span>5. B.Tech & Backlog Information</span>
                        </div>

                        <div className="form-grid">
                            <div className="form-group">
                                <label className="form-label">
                                    Current B.Tech CGPA (0.00 to 10.00) <span className="required">*</span>
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    name="btech_cgpa"
                                    className="form-control"
                                    placeholder="e.g. 8.75"
                                    value={formData.btech_cgpa}
                                    onChange={handleChange}
                                />
                                {errors.btech_cgpa && <div className="form-error">{errors.btech_cgpa}</div>}
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    Current B.Tech Percentage (0-100) <span className="required">*</span>
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    name="btech_percentage"
                                    className="form-control"
                                    placeholder="e.g. 87.50"
                                    value={formData.btech_percentage}
                                    onChange={handleChange}
                                />
                                {errors.btech_percentage && <div className="form-error">{errors.btech_percentage}</div>}
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    Number of Active Backlogs <span className="required">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="active_backlogs"
                                    className="form-control"
                                    placeholder="Enter 0 if none"
                                    value={formData.active_backlogs}
                                    onChange={handleChange}
                                />
                                {errors.active_backlogs && <div className="form-error">{errors.active_backlogs}</div>}
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    Total History of Backlogs <span className="required">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="total_backlog_history"
                                    className="form-control"
                                    placeholder="Total ever carried (0 if none)"
                                    value={formData.total_backlog_history}
                                    onChange={handleChange}
                                />
                                {errors.total_backlog_history && <div className="form-error">{errors.total_backlog_history}</div>}
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 6: Career Information & Documents */}
                {currentStep === 6 && (
                    <div className="card">
                        <div className="card-title">
                            <Briefcase size={22} />
                            <span>6. Career Information & Document Status</span>
                        </div>

                        <div className="form-grid">
                            <div className="form-group">
                                <label className="form-label">
                                    Interested in Campus Placements? <span className="required">*</span>
                                </label>
                                <select
                                    name="campus_placement_interest"
                                    className="form-control"
                                    value={formData.campus_placement_interest}
                                    onChange={handleChange}
                                >
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                    <option value="Undecided">Undecided</option>
                                </select>
                                {errors.campus_placement_interest && <div className="form-error">{errors.campus_placement_interest}</div>}
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    Primary Career Preference <span className="required">*</span>
                                </label>
                                <select
                                    name="primary_career_preference"
                                    className="form-control"
                                    value={formData.primary_career_preference}
                                    onChange={handleChange}
                                >
                                    <option value="Campus Placements">Campus Placements</option>
                                    <option value="Higher Studies - India">Higher Studies - India</option>
                                    <option value="Higher Studies - Abroad">Higher Studies - Abroad</option>
                                    <option value="Entrepreneurship">Entrepreneurship</option>
                                    <option value="Government / Competitive Exams">Government / Competitive Exams</option>
                                    <option value="Family Business">Family Business</option>
                                    <option value="Other">Other</option>
                                    <option value="Undecided">Undecided</option>
                                </select>
                                {errors.primary_career_preference && <div className="form-error">{errors.primary_career_preference}</div>}
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    Aadhaar Status <span className="required">*</span>
                                </label>
                                <select
                                    name="aadhaar_status"
                                    className="form-control"
                                    value={formData.aadhaar_status}
                                    onChange={handleChange}
                                >
                                    <option value="Available and Updated">Available and Updated</option>
                                    <option value="Available but Needs Update">Available but Needs Update</option>
                                    <option value="Not Available">Not Available</option>
                                </select>
                                {errors.aadhaar_status && <div className="form-error">{errors.aadhaar_status}</div>}
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    Aadhaar Number <span className="required">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="aadhaar_number"
                                    className="form-control"
                                    placeholder="12-digit Aadhaar Number"
                                    value={formData.aadhaar_number}
                                    onChange={handleChange}
                                    maxLength={12}
                                />
                                {errors.aadhaar_number && <div className="form-error">{errors.aadhaar_number}</div>}
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    PAN Status <span className="required">*</span>
                                </label>
                                <select
                                    name="pan_status"
                                    className="form-control"
                                    value={formData.pan_status}
                                    onChange={handleChange}
                                >
                                    <option value="Available">Available</option>
                                    <option value="Applied">Applied</option>
                                    <option value="Not Available">Not Available</option>
                                </select>
                                {errors.pan_status && <div className="form-error">{errors.pan_status}</div>}
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    PAN Number {formData.pan_status === 'Available' && <span className="required">*</span>}
                                </label>
                                <input
                                    type="text"
                                    name="pan_number"
                                    className="form-control"
                                    placeholder="10-character PAN (e.g. ABCDE1234F)"
                                    value={formData.pan_number}
                                    onChange={handleChange}
                                    maxLength={10}
                                    style={{ textTransform: 'uppercase' }}
                                />
                                {errors.pan_number && <div className="form-error">{errors.pan_number}</div>}
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    Passport Status <span className="required">*</span>
                                </label>
                                <select
                                    name="passport_status"
                                    className="form-control"
                                    value={formData.passport_status}
                                    onChange={handleChange}
                                >
                                    <option value="Available">Available</option>
                                    <option value="Applied">Applied</option>
                                    <option value="Not Available">Not Available</option>
                                </select>
                                {errors.passport_status && <div className="form-error">{errors.passport_status}</div>}
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    Passport ID / Number {formData.passport_status === 'Available' && <span className="required">*</span>}
                                </label>
                                <input
                                    type="text"
                                    name="passport_number"
                                    className="form-control"
                                    placeholder="Passport ID"
                                    value={formData.passport_number}
                                    onChange={handleChange}
                                    style={{ textTransform: 'uppercase' }}
                                />
                                {errors.passport_number && <div className="form-error">{errors.passport_number}</div>}
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 7: Declaration & Final Confirmation */}
                {currentStep === 7 && (
                    <div className="card">
                        <div className="card-title">
                            <FileText size={22} />
                            <span>7. Confirmation & Declaration</span>
                        </div>

                        {submitError && (
                            <div className="alert alert-danger">
                                <AlertCircle size={20} />
                                <span>{submitError}</span>
                            </div>
                        )}

                        <div style={{ background: '#F8FAFC', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '1.25rem', marginBottom: '1.5rem' }}>
                            <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem' }}>
                                Summary Review
                            </h4>
                            <div className="detail-grid">
                                <div><strong>Reg No:</strong> {(formData.registration_number || '').toUpperCase()}</div>
                                <div><strong>Official Name:</strong> {formData.student_name}</div>
                                <div><strong>First / Last Name:</strong> {formData.first_name} {formData.last_name}</div>
                                <div><strong>Batch / Branch / Sec:</strong> {formData.batch} - {formData.branch} - {formData.section}</div>
                                <div><strong>Mobile / Alt Mobile:</strong> {formData.student_mobile} / {formData.alternate_mobile}</div>
                                <div><strong>Personal Email:</strong> {formData.personal_email}</div>
                                <div><strong>University Email:</strong> {formData.university_email}</div>
                                <div><strong>B.Tech CGPA / %:</strong> {formData.btech_cgpa} / {formData.btech_percentage}%</div>
                            </div>
                        </div>

                        <div className="form-group full-width">
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', padding: '1rem', background: '#FFFFFF', border: '2px solid var(--primary-light)', borderRadius: 'var(--radius-sm)' }}>
                                <input
                                    type="checkbox"
                                    name="student_declaration"
                                    checked={formData.student_declaration}
                                    onChange={handleChange}
                                    style={{ width: '20px', height: '20px', accentColor: 'var(--primary)' }}
                                />
                                <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>
                                    I confirm that the information provided by me is correct.
                                </span>
                            </label>
                            {errors.student_declaration && <div className="form-error">{errors.student_declaration}</div>}
                        </div>
                    </div>
                )}

                {/* Navigation Buttons */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem' }}>
                    {currentStep > 1 ? (
                        <button type="button" className="btn btn-secondary" onClick={handleBack}>
                            <ArrowLeft size={18} /> Previous
                        </button>
                    ) : <div />}

                    {currentStep < STEPS.length ? (
                        <button type="button" className="btn btn-primary" onClick={handleNext}>
                            Next Step <ArrowRight size={18} />
                        </button>
                    ) : (
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={submitting}
                        >
                            {submitting ? 'Submitting...' : 'Submit Student Form'} <Check size={18} />
                        </button>
                    )}
                </div>

            </form>
        </div>
    );
}
