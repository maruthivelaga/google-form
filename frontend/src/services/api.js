// In production (Docker), nginx serves the app at /data-form/ and proxies /data-form/praveentp/ → backend:5000/praveentp/
// In local dev, Vite proxy forwards /praveentp → localhost:5000
const API_BASE = import.meta.env.PROD ? '/data-form/praveentp' : '/praveentp';

export const lookupStudent = async (regNo) => {
    const res = await fetch(`${API_BASE}/students/lookup/${encodeURIComponent(regNo)}`);
    if (!res.ok) {
        throw new Error('Failed to lookup student');
    }
    return res.json();
};

export const submitStudentForm = async (formData) => {
    const res = await fetch(`${API_BASE}/students/submit`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    });
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || 'Failed to submit form');
    }
    return data;
};

export const adminLogin = async (password) => {
    const res = await fetch(`${API_BASE}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
    });
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
    }
    return data;
};

export const fetchAdminStats = async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.batch) params.append('batch', filters.batch);
    if (filters.branch) params.append('branch', filters.branch);

    const res = await fetch(`${API_BASE}/admin/stats?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch stats');
    return res.json();
};

export const fetchAdminSections = async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.batch) params.append('batch', filters.batch);
    if (filters.branch) params.append('branch', filters.branch);

    const res = await fetch(`${API_BASE}/admin/sections?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch sections');
    return res.json();
};

export const fetchFilterOptions = async () => {
    const res = await fetch(`${API_BASE}/admin/options`);
    if (!res.ok) throw new Error('Failed to fetch filter options');
    return res.json();
};

export const fetchAdminStudents = async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.batch) params.append('batch', filters.batch);
    if (filters.branch) params.append('branch', filters.branch);
    if (filters.section) params.append('section', filters.section);
    if (filters.status) params.append('status', filters.status);
    if (filters.search) params.append('search', filters.search);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);

    const res = await fetch(`${API_BASE}/admin/students?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch students');
    return res.json();
};

export const fetchStudentDetails = async (id) => {
    const res = await fetch(`${API_BASE}/admin/students/${id}`);
    if (!res.ok) throw new Error('Failed to fetch student details');
    return res.json();
};

export const resetStudentStatus = async (id) => {
    const res = await fetch(`${API_BASE}/admin/students/${id}/reset`, {
        method: 'POST'
    });
    if (!res.ok) throw new Error('Failed to reset student submission');
    return res.json();
};

export const getExportCsvUrl = (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.batch) params.append('batch', filters.batch);
    if (filters.branch) params.append('branch', filters.branch);
    if (filters.section) params.append('section', filters.section);
    if (filters.status) params.append('status', filters.status);
    if (filters.search) params.append('search', filters.search);

    return `${API_BASE}/admin/export?${params.toString()}`;
};

export const getSectionListExportUrl = (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.batch) params.append('batch', filters.batch);
    if (filters.branch) params.append('branch', filters.branch);
    if (filters.section) params.append('section', filters.section);

    return `${API_BASE}/admin/export-section-list?${params.toString()}`;
};

export const getSubmittedExcelExportUrl = (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.batch) params.append('batch', filters.batch);
    if (filters.branch) params.append('branch', filters.branch);
    if (filters.section) params.append('section', filters.section);
    if (filters.search) params.append('search', filters.search);

    return `${API_BASE}/admin/export-submitted-excel?${params.toString()}`;
};
