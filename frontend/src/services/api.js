// In production (Docker), nginx serves the app at /data-form/ and proxies /data-form/praveentp/ → backend:5000/praveentp/
// In local dev, Vite proxy forwards /praveentp → localhost:5000
const API_BASE = import.meta.env.PROD ? '/data-form/praveentp' : '/praveentp';

const getAuthHeaders = () => {
    const token = sessionStorage.getItem('admin_token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

const handleAdminResponse = async (res) => {
    if (res.status === 401) {
        sessionStorage.removeItem('admin_token');
        sessionStorage.removeItem('admin_authenticated');
        window.location.reload();
        throw new Error('Session expired. Please log in again.');
    }
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
        throw new Error(data.error || data.message || 'Request failed');
    }
    return data;
};

export const lookupStudent = async (regNo) => {
    const res = await fetch(`${API_BASE}/students/lookup/${encodeURIComponent(regNo)}`);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
        throw new Error(data.error || data.message || 'Failed to lookup student');
    }
    return data;
};

export const submitStudentForm = async (formData) => {
    const res = await fetch(`${API_BASE}/students/submit`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
        throw new Error(data.error || data.message || 'Failed to submit form');
    }
    return data;
};

export const adminLogin = async (password) => {
    const res = await fetch(`${API_BASE}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
        throw new Error(data.error || data.message || 'Authentication failed');
    }
    return data;
};

export const fetchAdminStats = async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.batch) params.append('batch', filters.batch);
    if (filters.branch) params.append('branch', filters.branch);

    const res = await fetch(`${API_BASE}/admin/stats?${params.toString()}`, {
        headers: { ...getAuthHeaders() }
    });
    return handleAdminResponse(res);
};

export const fetchAdminSections = async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.batch) params.append('batch', filters.batch);
    if (filters.branch) params.append('branch', filters.branch);

    const res = await fetch(`${API_BASE}/admin/sections?${params.toString()}`, {
        headers: { ...getAuthHeaders() }
    });
    return handleAdminResponse(res);
};

export const fetchFilterOptions = async () => {
    const res = await fetch(`${API_BASE}/admin/options`, {
        headers: { ...getAuthHeaders() }
    });
    return handleAdminResponse(res);
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

    const res = await fetch(`${API_BASE}/admin/students?${params.toString()}`, {
        headers: { ...getAuthHeaders() }
    });
    return handleAdminResponse(res);
};

export const fetchStudentDetails = async (id) => {
    const res = await fetch(`${API_BASE}/admin/students/${id}`, {
        headers: { ...getAuthHeaders() }
    });
    return handleAdminResponse(res);
};


const getAdminToken = () => sessionStorage.getItem('admin_token') || '';

export const getExportCsvUrl = (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.batch) params.append('batch', filters.batch);
    if (filters.branch) params.append('branch', filters.branch);
    if (filters.section) params.append('section', filters.section);
    if (filters.status) params.append('status', filters.status);
    if (filters.search) params.append('search', filters.search);
    const token = getAdminToken();
    if (token) params.append('token', token);

    return `${API_BASE}/admin/export?${params.toString()}`;
};

export const getSectionListExportUrl = (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.batch) params.append('batch', filters.batch);
    if (filters.branch) params.append('branch', filters.branch);
    if (filters.section) params.append('section', filters.section);
    const token = getAdminToken();
    if (token) params.append('token', token);

    return `${API_BASE}/admin/export-section-list?${params.toString()}`;
};

export const getSubmittedExcelExportUrl = (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.batch) params.append('batch', filters.batch);
    if (filters.branch) params.append('branch', filters.branch);
    if (filters.section) params.append('section', filters.section);
    if (filters.search) params.append('search', filters.search);
    const token = getAdminToken();
    if (token) params.append('token', token);

    return `${API_BASE}/admin/export-submitted-excel?${params.toString()}`;
};
