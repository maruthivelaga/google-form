import React, { useState } from 'react';
import { updateStudentDetails } from '../services/api';
import { X, Save, AlertCircle, CheckCircle2, User, Phone, BookOpen, Award, Briefcase, FileText } from 'lucide-react';

export default function EditStudentModal({ student, onClose, onSaveSuccess }) {
    if (!student) return null;

    const [formData, setFormData] = useState({
        registration_number: student.registration_number || '',
        student_name: student.student_name || '',
        first_name: student.first_name || '',
        middle_name: student.middle_name || '',
        last_name: student.last_name || '',
        batch: student.batch || '2023-27',
        branch: student.branch || 'CSE',
        section: student.section || '1',
        gender: student.gender || 'Male',
        dob: student.dob ? new Date(student.dob).toISOString().split('T')[0] : '',
        student_mobile: student.student_mobile || '',
        alternate_mobile: student.alternate_mobile || '',
        personal_email: student.personal_email || '',
        university_email: student.university_email || '',
        current_address: student.current_address || '',
        permanent_address: student.permanent_address || '',
        tenth_board: student.tenth_board || '',
        tenth_pass_year: student.tenth_pass_year || '',
        tenth_percentage: student.tenth_percentage || '',
        qualification_after_tenth: student.qualification_after_tenth || 'Intermediate / 12th',
        inter_diploma_board: student.inter_diploma_board || '',
        inter_diploma_pass_year: student.inter_diploma_pass_year || '',
        inter_diploma_percentage: student.inter_diploma_percentage || '',
        btech_cgpa: student.btech_cgpa || '',
        btech_percentage: student.btech_percentage || '',
        active_backlogs: student.active_backlogs !== undefined ? String(student.active_backlogs) : '0',
        total_backlog_history: student.total_backlog_history !== undefined ? String(student.total_backlog_history) : '0',
        campus_placement_interest: student.campus_placement_interest || 'Yes',
        primary_career_preference: student.primary_career_preference || 'Campus Placements',
        aadhaar_status: student.aadhaar_status || 'Available and Updated',
        aadhaar_number: student.aadhaar_number || '',
        pan_status: student.pan_status || 'Available',
        pan_number: student.pan_number || '',
        passport_status: student.passport_status || 'Not Available',
        passport_number: student.passport_number || '',
        submission_status: student.submission_status || 'NOT_SUBMITTED'
    });

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        let val = value;

        if (name === 'registration_number' || name === 'student_name' || name === 'first_name' || name === 'middle_name' || name === 'last_name' || name === 'pan_number' || name === 'passport_number') {
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
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        setSuccessMsg('');

        try {
            const result = await updateStudentDetails(student.id, formData);
            setSuccessMsg('Student record updated successfully!');
            setTimeout(() => {
                if (onSaveSuccess) onSaveSuccess(result.student || result);
                onClose();
            }, 600);
        } catch (err) {
            setError(err.message || 'Failed to update student details');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" style={{ maxWidth: '850px', maxHeight: '90vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>
                            Edit Student Master Record
                        </h3>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            Registration Number: <strong>{student.registration_number}</strong>
                        </span>
                    </div>
                    <button 
                        onClick={onClose} 
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        {error && (
                            <div className="alert alert-danger" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <AlertCircle size={18} />
                                <span>{error}</span>
                            </div>
                        )}

                        {successMsg && (
                            <div className="alert" style={{ background: 'var(--green-light)', color: 'var(--green)', border: '1px solid #86EFAC', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <CheckCircle2 size={18} />
                                <span>{successMsg}</span>
                            </div>
                        )}

                        {/* Section 1: Personal & Identity */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <h4 className="card-title" style={{ fontSize: '1rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <User size={18} /> 1. Personal & Identity
                            </h4>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label className="form-label">Registration Number</label>
                                    <input type="text" name="registration_number" className="form-control" value={formData.registration_number} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Student Name as per University</label>
                                    <input type="text" name="student_name" className="form-control" value={formData.student_name} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">First Name</label>
                                    <input type="text" name="first_name" className="form-control" value={formData.first_name} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Middle Name</label>
                                    <input type="text" name="middle_name" className="form-control" value={formData.middle_name} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Last Name</label>
                                    <input type="text" name="last_name" className="form-control" value={formData.last_name} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Batch</label>
                                    <select name="batch" className="form-control" value={formData.batch} onChange={handleChange}>
                                        <option value="2023-27">2023-27</option>
                                        <option value="2024-28">2024-28</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Branch</label>
                                    <input type="text" name="branch" className="form-control" value={formData.branch} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Section</label>
                                    <input type="text" name="section" className="form-control" value={formData.section} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Gender</label>
                                    <select name="gender" className="form-control" value={formData.gender} onChange={handleChange}>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Date of Birth</label>
                                    <input type="date" name="dob" className="form-control" value={formData.dob} onChange={handleChange} />
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Contact Information & Address */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <h4 className="card-title" style={{ fontSize: '1rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Phone size={18} /> 2. Contact Information & Address
                            </h4>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label className="form-label">Personal Email</label>
                                    <input type="email" name="personal_email" className="form-control" value={formData.personal_email} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">University Email</label>
                                    <input type="email" name="university_email" className="form-control" value={formData.university_email} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Student Mobile</label>
                                    <input type="tel" name="student_mobile" className="form-control" value={formData.student_mobile} onChange={handleChange} maxLength={10} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Alternate Mobile</label>
                                    <input type="tel" name="alternate_mobile" className="form-control" value={formData.alternate_mobile} onChange={handleChange} maxLength={10} />
                                </div>
                                <div className="form-group full-width">
                                    <label className="form-label">Current Address</label>
                                    <textarea name="current_address" className="form-control" rows={2} value={formData.current_address} onChange={handleChange} />
                                </div>
                                <div className="form-group full-width">
                                    <label className="form-label">Permanent Address</label>
                                    <textarea name="permanent_address" className="form-control" rows={2} value={formData.permanent_address} onChange={handleChange} />
                                </div>
                            </div>
                        </div>

                        {/* Section 3: 10th / SSC Information */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <h4 className="card-title" style={{ fontSize: '1rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <BookOpen size={18} /> 3. 10th / SSC Information
                            </h4>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label className="form-label">10th Board</label>
                                    <input type="text" name="tenth_board" className="form-control" value={formData.tenth_board} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">10th Pass Year</label>
                                    <input type="number" name="tenth_pass_year" className="form-control" value={formData.tenth_pass_year} onChange={handleChange} placeholder="Year (e.g. 2020)" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">10th Percentage</label>
                                    <input type="number" step="0.01" name="tenth_percentage" className="form-control" value={formData.tenth_percentage} onChange={handleChange} placeholder="e.g. 95.00" />
                                </div>
                            </div>
                        </div>

                        {/* Section 4: Intermediate / Diploma */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <h4 className="card-title" style={{ fontSize: '1rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Award size={18} /> 4. Intermediate / Diploma Information
                            </h4>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label className="form-label">Qualification</label>
                                    <select name="qualification_after_tenth" className="form-control" value={formData.qualification_after_tenth} onChange={handleChange}>
                                        <option value="Intermediate / 12th">Intermediate / 12th</option>
                                        <option value="Diploma">Diploma</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Board / Institute</label>
                                    <input type="text" name="inter_diploma_board" className="form-control" value={formData.inter_diploma_board} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Pass Year</label>
                                    <input type="number" name="inter_diploma_pass_year" className="form-control" value={formData.inter_diploma_pass_year} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Percentage</label>
                                    <input type="number" step="0.01" name="inter_diploma_percentage" className="form-control" value={formData.inter_diploma_percentage} onChange={handleChange} />
                                </div>
                            </div>
                        </div>

                        {/* Section 5: B.Tech & Backlogs */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <h4 className="card-title" style={{ fontSize: '1rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <BookOpen size={18} /> 5. B.Tech & Backlog Information
                            </h4>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label className="form-label">Current B.Tech CGPA</label>
                                    <input type="number" step="0.01" name="btech_cgpa" className="form-control" value={formData.btech_cgpa} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">B.Tech Percentage</label>
                                    <input type="number" step="0.01" name="btech_percentage" className="form-control" value={formData.btech_percentage} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Active Backlogs</label>
                                    <input type="number" name="active_backlogs" className="form-control" value={formData.active_backlogs} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Total Backlog History</label>
                                    <input type="number" name="total_backlog_history" className="form-control" value={formData.total_backlog_history} onChange={handleChange} />
                                </div>
                            </div>
                        </div>

                        {/* Section 6: Career & Documents */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <h4 className="card-title" style={{ fontSize: '1rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Briefcase size={18} /> 6. Career & Documents
                            </h4>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label className="form-label">Placement Interest</label>
                                    <select name="campus_placement_interest" className="form-control" value={formData.campus_placement_interest} onChange={handleChange}>
                                        <option value="Yes">Yes</option>
                                        <option value="No">No</option>
                                        <option value="Undecided">Undecided</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Career Preference</label>
                                    <select name="primary_career_preference" className="form-control" value={formData.primary_career_preference} onChange={handleChange}>
                                        <option value="Campus Placements">Campus Placements</option>
                                        <option value="Higher Studies - India">Higher Studies - India</option>
                                        <option value="Higher Studies - Abroad">Higher Studies - Abroad</option>
                                        <option value="Entrepreneurship">Entrepreneurship</option>
                                        <option value="Government / Competitive Exams">Government / Competitive Exams</option>
                                        <option value="Family Business">Family Business</option>
                                        <option value="Other">Other</option>
                                        <option value="Undecided">Undecided</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Aadhaar Status</label>
                                    <select name="aadhaar_status" className="form-control" value={formData.aadhaar_status} onChange={handleChange}>
                                        <option value="Available and Updated">Available and Updated</option>
                                        <option value="Available but Needs Update">Available but Needs Update</option>
                                        <option value="Not Available">Not Available</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Aadhaar Number</label>
                                    <input type="text" name="aadhaar_number" className="form-control" value={formData.aadhaar_number} onChange={handleChange} maxLength={12} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">PAN Status</label>
                                    <select name="pan_status" className="form-control" value={formData.pan_status} onChange={handleChange}>
                                        <option value="Available">Available</option>
                                        <option value="Applied">Applied</option>
                                        <option value="Not Available">Not Available</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">PAN Number</label>
                                    <input type="text" name="pan_number" className="form-control" value={formData.pan_number} onChange={handleChange} maxLength={10} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Passport Status</label>
                                    <select name="passport_status" className="form-control" value={formData.passport_status} onChange={handleChange}>
                                        <option value="Available">Available</option>
                                        <option value="Applied">Applied</option>
                                        <option value="Not Available">Not Available</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Passport ID / Number</label>
                                    <input type="text" name="passport_number" className="form-control" value={formData.passport_number} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Submission Status</label>
                                    <select name="submission_status" className="form-control" value={formData.submission_status} onChange={handleChange}>
                                        <option value="SUBMITTED">Submitted</option>
                                        <option value="NOT_SUBMITTED">Not Submitted (Pending)</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="modal-footer" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                        <button type="button" className="btn btn-secondary" onClick={onClose} disabled={saving}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={saving}>
                            <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
