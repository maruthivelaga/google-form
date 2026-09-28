import React from 'react';
import { X, CheckCircle2, Clock } from 'lucide-react';

export default function StudentDetailsModal({ student, onClose }) {
    if (!student) return null;

    const isSubmitted = student.submission_status === 'SUBMITTED';

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>
                            Student Master Record
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

                <div className="modal-body">
                    {/* Status Badge & Timestamp Banner */}
                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        padding: '1rem', 
                        background: isSubmitted ? 'var(--green-light)' : 'var(--amber-light)',
                        borderRadius: 'var(--radius-sm)',
                        border: `1px solid ${isSubmitted ? '#86EFAC' : '#FCD34D'}`
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            {isSubmitted ? (
                                <>
                                    <CheckCircle2 size={20} color="#15803D" />
                                    <span style={{ fontWeight: 700, color: '#15803D' }}>Submission Complete</span>
                                </>
                            ) : (
                                <>
                                    <Clock size={20} color="#B45309" />
                                    <span style={{ fontWeight: 700, color: '#B45309' }}>Pending Submission</span>
                                </>
                            )}
                        </div>
                        {student.submitted_at && (
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                Submitted At: {new Date(student.submitted_at).toLocaleString()}
                            </span>
                        )}
                    </div>

                    {/* Section 1: Personal / Identity */}
                    <div>
                        <h4 className="card-title" style={{ fontSize: '1rem', marginBottom: '0.75rem', paddingBottom: '0.4rem' }}>
                            1. Personal & Identity
                        </h4>
                        <div className="detail-grid">
                            <div className="detail-item"><span className="detail-label">Reg. Number</span><span className="detail-value">{student.registration_number}</span></div>
                            <div className="detail-item"><span className="detail-label">Student Name</span><span className="detail-value">{student.student_name || 'N/A'}</span></div>
                            {student.first_name && <div className="detail-item"><span className="detail-label">First Name</span><span className="detail-value">{student.first_name}</span></div>}
                            {student.middle_name && <div className="detail-item"><span className="detail-label">Middle Name</span><span className="detail-value">{student.middle_name}</span></div>}
                            {student.last_name && <div className="detail-item"><span className="detail-label">Last Name</span><span className="detail-value">{student.last_name}</span></div>}
                            <div className="detail-item"><span className="detail-label">Batch</span><span className="detail-value">{student.batch}</span></div>
                            <div className="detail-item"><span className="detail-label">Branch</span><span className="detail-value">{student.branch}</span></div>
                            <div className="detail-item"><span className="detail-label">Section</span><span className="detail-value">{student.section}</span></div>
                            <div className="detail-item"><span className="detail-label">Gender</span><span className="detail-value">{student.gender || 'N/A'}</span></div>
                            <div className="detail-item"><span className="detail-label">Date of Birth</span><span className="detail-value">{student.dob ? new Date(student.dob).toLocaleDateString() : 'N/A'}</span></div>
                        </div>
                    </div>

                    {/* Section 2: Contact Information */}
                    <div>
                        <h4 className="card-title" style={{ fontSize: '1rem', marginBottom: '0.75rem', paddingBottom: '0.4rem' }}>
                            2. Contact Information & Addresses
                        </h4>
                        <div className="detail-grid">
                            <div className="detail-item"><span className="detail-label">Personal Email</span><span className="detail-value">{student.personal_email || 'N/A'}</span></div>
                            <div className="detail-item"><span className="detail-label">University Email</span><span className="detail-value">{student.university_email || 'N/A'}</span></div>
                            <div className="detail-item"><span className="detail-label">Student Mobile</span><span className="detail-value">{student.student_mobile || 'N/A'}</span></div>
                            <div className="detail-item"><span className="detail-label">Alternate Mobile</span><span className="detail-value">{student.alternate_mobile || 'N/A'}</span></div>
                            <div className="detail-item" style={{ gridColumn: 'span 2' }}><span className="detail-label">Current Address</span><span className="detail-value">{student.current_address || 'N/A'}</span></div>
                            <div className="detail-item" style={{ gridColumn: 'span 2' }}><span className="detail-label">Permanent Address</span><span className="detail-value">{student.permanent_address || 'N/A'}</span></div>
                        </div>
                    </div>

                    {/* Section 3: 10th / SSC */}
                    <div>
                        <h4 className="card-title" style={{ fontSize: '1rem', marginBottom: '0.75rem', paddingBottom: '0.4rem' }}>
                            3. 10th / SSC Information
                        </h4>
                        <div className="detail-grid">
                            <div className="detail-item"><span className="detail-label">10th Board</span><span className="detail-value">{student.tenth_board || 'N/A'}</span></div>
                            <div className="detail-item"><span className="detail-label">10th Pass Year</span><span className="detail-value">{student.tenth_pass_year || 'N/A'}</span></div>
                            <div className="detail-item"><span className="detail-label">10th Percentage</span><span className="detail-value">{student.tenth_percentage ? `${student.tenth_percentage}%` : 'N/A'}</span></div>
                        </div>
                    </div>

                    {/* Section 4: Inter / Diploma */}
                    <div>
                        <h4 className="card-title" style={{ fontSize: '1rem', marginBottom: '0.75rem', paddingBottom: '0.4rem' }}>
                            4. Intermediate / Diploma
                        </h4>
                        <div className="detail-grid">
                            <div className="detail-item"><span className="detail-label">Qualification</span><span className="detail-value">{student.qualification_after_tenth || 'N/A'}</span></div>
                            <div className="detail-item"><span className="detail-label">Board / Institute</span><span className="detail-value">{student.inter_diploma_board || 'N/A'}</span></div>
                            <div className="detail-item"><span className="detail-label">Pass Year</span><span className="detail-value">{student.inter_diploma_pass_year || 'N/A'}</span></div>
                            <div className="detail-item"><span className="detail-label">Percentage</span><span className="detail-value">{student.inter_diploma_percentage ? `${student.inter_diploma_percentage}%` : 'N/A'}</span></div>
                        </div>
                    </div>

                    {/* Section 5: B.Tech & Backlogs */}
                    <div>
                        <h4 className="card-title" style={{ fontSize: '1rem', marginBottom: '0.75rem', paddingBottom: '0.4rem' }}>
                            5. B.Tech & Backlogs
                        </h4>
                        <div className="detail-grid">
                            <div className="detail-item"><span className="detail-label">Current B.Tech CGPA</span><span className="detail-value">{student.btech_cgpa || 'N/A'}</span></div>
                            <div className="detail-item"><span className="detail-label">B.Tech Percentage</span><span className="detail-value">{student.btech_percentage ? `${student.btech_percentage}%` : 'N/A'}</span></div>
                            <div className="detail-item"><span className="detail-label">Active Backlogs</span><span className="detail-value">{student.active_backlogs ?? 'N/A'}</span></div>
                            <div className="detail-item"><span className="detail-label">Total Backlog History</span><span className="detail-value">{student.total_backlog_history ?? 'N/A'}</span></div>
                        </div>
                    </div>

                    {/* Section 6 & 7: Career, Docs, Declaration */}
                    <div>
                        <h4 className="card-title" style={{ fontSize: '1rem', marginBottom: '0.75rem', paddingBottom: '0.4rem' }}>
                            6. Career & Documents
                        </h4>
                        <div className="detail-grid">
                            <div className="detail-item"><span className="detail-label">Campus Placement Interest</span><span className="detail-value">{student.campus_placement_interest || 'N/A'}</span></div>
                            <div className="detail-item"><span className="detail-label">Career Preference</span><span className="detail-value">{student.primary_career_preference || 'N/A'}</span></div>
                            <div className="detail-item"><span className="detail-label">Aadhaar Status</span><span className="detail-value">{student.aadhaar_status || 'N/A'}</span></div>
                            <div className="detail-item"><span className="detail-label">Aadhaar Number</span><span className="detail-value">{student.aadhaar_number || 'N/A'}</span></div>
                            <div className="detail-item"><span className="detail-label">PAN Status</span><span className="detail-value">{student.pan_status || 'N/A'}</span></div>
                            <div className="detail-item"><span className="detail-label">PAN Number</span><span className="detail-value">{student.pan_number || 'N/A'}</span></div>
                            <div className="detail-item"><span className="detail-label">Passport Status</span><span className="detail-value">{student.passport_status || 'N/A'}</span></div>
                            <div className="detail-item"><span className="detail-label">Passport ID / Number</span><span className="detail-value">{student.passport_number || 'N/A'}</span></div>
                            <div className="detail-item"><span className="detail-label">Declaration</span><span className="detail-value">{student.student_declaration || 'N/A'}</span></div>
                        </div>
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="btn btn-primary" onClick={onClose}>
                        Close Window
                    </button>
                </div>
            </div>
        </div>
    );
}
