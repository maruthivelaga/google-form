import React, { useState, useEffect, useCallback } from 'react';
import { 
    fetchAdminStats, 
    fetchFilterOptions, 
    fetchAdminStudents, 
    fetchStudentDetails,
    getExportCsvUrl,
    getSectionListExportUrl,
    getSubmittedExcelExportUrl
} from '../services/api';
import StudentDetailsModal from './StudentDetailsModal';
import { 
    Users, 
    CheckCircle2, 
    Clock, 
    BarChart3, 
    Download, 
    Search, 
    Eye, 
    Filter,
    ChevronLeft,
    ChevronRight,
    RefreshCw,
    AlertCircle,
    GraduationCap,
    FileDown,
    FileSpreadsheet
} from 'lucide-react';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        total: 0, submitted: 0, pending: 0, percentage: 0,
        second_year_pending: 0, final_year_pending: 0,
        second_year_total: 0, final_year_total: 0
    });
    const [filterOptions, setFilterOptions] = useState({ batches: [], branches: [], sections: [] });
    
    // Active filters
    const [filters, setFilters] = useState({
        batch: '',
        branch: '',
        section: '',
        status: 'ALL',
        search: '',
        page: 1,
        limit: 50
    });

    const [studentsData, setStudentsData] = useState({ students: [], total: 0, page: 1, totalPages: 1 });
    const [loading, setLoading] = useState(true);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    // Fetch initial dropdown options
    useEffect(() => {
        const loadOptions = async () => {
            try {
                const opts = await fetchFilterOptions();
                setFilterOptions(opts);
            } catch (err) {
                console.error('Error loading filter options:', err);
            }
        };
        loadOptions();
    }, []);

    // Load Dashboard Stats and Students table
    const loadDashboardData = useCallback(async () => {
        setLoading(true);
        try {
            const [statsRes, listRes] = await Promise.all([
                fetchAdminStats({ batch: filters.batch, branch: filters.branch }),
                fetchAdminStudents(filters)
            ]);
            setStats(statsRes);
            setStudentsData(listRes);
        } catch (err) {
            console.error('Error loading dashboard data:', err);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        loadDashboardData();
    }, [loadDashboardData]);

    const handleFilterChange = (field, value) => {
        setFilters(prev => ({
            ...prev,
            [field]: value,
            page: 1 // Reset to page 1 on filter change
        }));
    };

    const handleViewStudentDetails = async (id) => {
        try {
            const data = await fetchStudentDetails(id);
            setSelectedStudent(data);
            setModalOpen(true);
        } catch (err) {
            alert('Failed to load student details');
        }
    };


    const handleExportCsv = () => {
        const url = getExportCsvUrl(filters);
        window.open(url, '_blank');
    };

    const handleDownloadSectionList = (batchFilter) => {
        const url = getSectionListExportUrl({
            batch: batchFilter || filters.batch,
            branch: filters.branch,
            section: filters.section
        });
        window.open(url, '_blank');
    };

    const handleDownloadFilledStudents = () => {
        const url = getSubmittedExcelExportUrl(filters);
        window.open(url, '_blank');
    };

    return (
        <div>
            {/* Top Action Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-main)' }}>
                        Administrator Dashboard
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        Track real-time student master data collection progress and section breakdown.
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <button className="btn btn-secondary" onClick={loadDashboardData} title="Refresh Data">
                        <RefreshCw size={16} /> Refresh
                    </button>
                    <button 
                        className="btn btn-primary" 
                        style={{ backgroundColor: '#10B981', borderColor: '#10B981' }} 
                        onClick={handleDownloadFilledStudents} 
                        title="Download Filled Students Master Excel Sheet (.xlsx)"
                    >
                        <FileSpreadsheet size={16} /> Download Filled Students Data (.xlsx)
                    </button>
                    <button className="btn btn-primary" onClick={handleExportCsv}>
                        <Download size={16} /> Export Full CSV
                    </button>
                </div>
            </div>

            {/* KPI Cards Grid — 5 cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                {/* Card 1: Total */}
                <div className="stat-card">
                    <div className="stat-header">
                        <span>Total Students</span>
                        <div className="stat-icon" style={{ background: '#EEEDFF', color: 'var(--primary)' }}>
                            <Users size={20} />
                        </div>
                    </div>
                    <div className="stat-value">{stats.total.toLocaleString()}</div>
                </div>

                {/* Card 2: Submitted */}
                <div className="stat-card">
                    <div className="stat-header">
                        <span>Submitted</span>
                        <div className="stat-icon" style={{ background: 'var(--green-light)', color: 'var(--green)' }}>
                            <CheckCircle2 size={20} />
                        </div>
                    </div>
                    <div className="stat-value" style={{ color: 'var(--green)' }}>{stats.submitted.toLocaleString()}</div>
                </div>

                {/* Card 3: Overall Pending */}
                <div className="stat-card">
                    <div className="stat-header">
                        <span>Overall Pending</span>
                        <div className="stat-icon" style={{ background: 'var(--amber-light)', color: 'var(--amber)' }}>
                            <Clock size={20} />
                        </div>
                    </div>
                    <div className="stat-value" style={{ color: 'var(--amber)' }}>{stats.pending.toLocaleString()}</div>
                </div>

                {/* Card 5: 2nd Year Not Submitted */}
                <div className="stat-card" style={{ cursor: 'pointer', position: 'relative' }} onClick={() => handleDownloadSectionList('2024-28')}>
                    <div className="stat-header">
                        <span>2nd Year Not Submitted</span>
                        <div className="stat-icon" style={{ background: '#FEF3C7', color: '#D97706' }}>
                            <GraduationCap size={20} />
                        </div>
                    </div>
                    <div className="stat-value" style={{ color: '#D97706' }}>{stats.second_year_pending.toLocaleString()}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                        of {stats.second_year_total} total · <span style={{ color: '#D97706', fontWeight: 600 }}>↓ Download List</span>
                    </div>
                </div>

                {/* Card 6: Final Year Not Submitted */}
                <div className="stat-card" style={{ cursor: 'pointer', position: 'relative' }} onClick={() => handleDownloadSectionList('2023-27')}>
                    <div className="stat-header">
                        <span>Final Year Not Submitted</span>
                        <div className="stat-icon" style={{ background: '#FEE2E2', color: '#DC2626' }}>
                            <AlertCircle size={20} />
                        </div>
                    </div>
                    <div className="stat-value" style={{ color: '#DC2626' }}>{stats.final_year_pending.toLocaleString()}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                        of {stats.final_year_total} total · <span style={{ color: '#DC2626', fontWeight: 600 }}>↓ Download List</span>
                    </div>
                </div>
            </div>

            {/* Filter Toolbar */}
            <div className="filter-bar">
                <div className="filter-group">
                    <Filter size={16} color="var(--text-muted)" />
                    <label>Batch:</label>
                    <select 
                        className="filter-select" 
                        value={filters.batch}
                        onChange={(e) => handleFilterChange('batch', e.target.value)}
                    >
                        <option value="">All Batches</option>
                        {filterOptions.batches.map(b => (
                            <option key={b} value={b}>{b}</option>
                        ))}
                    </select>
                </div>

                <div className="filter-group">
                    <label>Branch:</label>
                    <select 
                        className="filter-select" 
                        value={filters.branch}
                        onChange={(e) => handleFilterChange('branch', e.target.value)}
                    >
                        <option value="">All Branches</option>
                        {filterOptions.branches.map(b => (
                            <option key={b} value={b}>{b}</option>
                        ))}
                    </select>
                </div>

                <div className="filter-group">
                    <label>Section:</label>
                    <select 
                        className="filter-select" 
                        value={filters.section}
                        onChange={(e) => handleFilterChange('section', e.target.value)}
                    >
                        <option value="">All Sections</option>
                        {filterOptions.sections.map(s => (
                            <option key={s} value={s}>Section {s}</option>
                        ))}
                    </select>
                </div>

                <div className="filter-group">
                    <label>Status:</label>
                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                        {['ALL', 'SUBMITTED', 'NOT_SUBMITTED'].map(st => (
                            <button
                                key={st}
                                type="button"
                                className={`btn ${filters.status === st ? 'btn-primary' : 'btn-secondary'}`}
                                style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                                onClick={() => handleFilterChange('status', st)}
                            >
                                {st === 'ALL' ? 'All' : st === 'SUBMITTED' ? 'Submitted' : 'Pending'}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="search-input-wrapper">
                    <Search size={16} className="search-icon" />
                    <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Search Reg No or Name..."
                        value={filters.search}
                        onChange={(e) => handleFilterChange('search', e.target.value)}
                    />
                </div>
            </div>

            {/* Main Student Data Table */}
            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Reg. No.</th>
                            <th>Student Name</th>
                            <th>Batch</th>
                            <th>Branch</th>
                            <th>Section</th>
                            <th>Status</th>
                            <th>Submitted At</th>
                            <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={8} style={{ textAlign: 'center', padding: '2rem' }}>
                                    Loading student records...
                                </td>
                            </tr>
                        ) : studentsData.students.length === 0 ? (
                            <tr>
                                <td colSpan={8} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                                    No student records match the selected filters.
                                </td>
                            </tr>
                        ) : (
                            studentsData.students.map(std => {
                                const isSub = std.submission_status === 'SUBMITTED';
                                return (
                                    <tr key={std.id}>
                                        <td style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                                            {std.registration_number}
                                        </td>
                                        <td>{std.student_name || '—'}</td>
                                        <td>{std.batch}</td>
                                        <td>{std.branch}</td>
                                        <td>Section {std.section}</td>
                                        <td>
                                            {isSub ? (
                                                <span className="badge badge-submitted">
                                                    ✓ Submitted
                                                </span>
                                            ) : (
                                                <span className="badge badge-pending">
                                                    ● Pending
                                                </span>
                                            )}
                                        </td>
                                        <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                            {std.submitted_at ? new Date(std.submitted_at).toLocaleDateString() : '—'}
                                        </td>
                                        <td style={{ textAlign: 'right' }}>
                                            <button 
                                                className="btn btn-secondary" 
                                                style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}
                                                onClick={() => handleViewStudentDetails(std.id)}
                                                title="View Full Record"
                                            >
                                                <Eye size={14} /> Details
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>

                {/* Table Pagination */}
                <div className="pagination">
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        Showing {studentsData.students.length} of {studentsData.total} students (Page {studentsData.page} of {studentsData.totalPages})
                    </span>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button 
                            className="btn btn-secondary" 
                            style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                            disabled={filters.page <= 1}
                            onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
                        >
                            <ChevronLeft size={16} /> Prev
                        </button>
                        <button 
                            className="btn btn-secondary" 
                            style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                            disabled={filters.page >= studentsData.totalPages}
                            onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
                        >
                            Next <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Detailed View Modal */}
            {modalOpen && (
                <StudentDetailsModal 
                    student={selectedStudent} 
                    onClose={() => setModalOpen(false)}
                />
            )}
        </div>
    );
}
