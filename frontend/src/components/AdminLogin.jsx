import React, { useState } from 'react';
import { adminLogin } from '../services/api';
import { ShieldCheck, Lock, AlertCircle, ArrowRight } from 'lucide-react';

export default function AdminLogin({ onLoginSuccess }) {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!password) {
            setError('Please enter the administrator password.');
            return;
        }

        setLoading(true);
        try {
            const data = await adminLogin(password);
            if (data.success && data.token) {
                sessionStorage.setItem('admin_token', data.token);
                sessionStorage.setItem('admin_authenticated', 'true');
                onLoginSuccess();
            } else {
                setError('Invalid password.');
            }
        } catch (err) {
            setError(err.message || 'Authentication failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '70vh',
            padding: '1rem'
        }}>
            <div className="card" style={{
                maxWidth: '420px',
                width: '100%',
                padding: '2.5rem 2rem',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '50%',
                        backgroundColor: '#EEEDFF',
                        color: 'var(--primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1.25rem'
                    }}>
                        <ShieldCheck size={36} />
                    </div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                        Admin Portal
                    </h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                        Please enter the administrator password to access student master management.
                    </p>
                </div>

                {error && (
                    <div className="alert alert-danger" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <AlertCircle size={18} />
                        <span style={{ fontSize: '0.85rem' }}>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                        <label className="form-label" style={{ fontWeight: 600 }}>
                            Admin Password
                        </label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Enter admin password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    if (error) setError('');
                                }}
                                style={{ paddingLeft: '2.5rem' }}
                                autoFocus
                            />
                            <Lock 
                                size={18} 
                                style={{ 
                                    position: 'absolute', 
                                    left: '0.85rem', 
                                    top: '50%', 
                                    transform: 'translateY(-50%)', 
                                    color: 'var(--text-muted)' 
                                }} 
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                        style={{ width: '100%', justifyContent: 'center', padding: '0.75rem 1rem', fontSize: '0.95rem' }}
                    >
                        {loading ? 'Authenticating...' : 'Access Admin Dashboard'}
                        {!loading && <ArrowRight size={18} />}
                    </button>
                </form>
            </div>
        </div>
    );
}
