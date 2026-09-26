import React from 'react';
import { GraduationCap, ShieldCheck } from 'lucide-react';

export default function Header({ currentView, setCurrentView, isAdminAuthed, onLogout }) {
    const isAdmin = currentView === 'admin';

    return (
        <header className="navbar">
            <a 
                href="#" 
                className="nav-brand" 
                onClick={(e) => { e.preventDefault(); setCurrentView('form'); }}
            >
                <div className="brand-icon">
                    <GraduationCap size={22} />
                </div>
                <span>Student Master Data Collection</span>
            </a>

            {/* Only show admin nav when in admin view */}
            {isAdmin && (
                <div className="nav-links">
                    <button
                        className="nav-link active"
                        title="Admin Dashboard"
                    >
                        <ShieldCheck size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'text-bottom' }} />
                        Admin Dashboard
                    </button>
                    {isAdminAuthed && onLogout && (
                        <button
                            className="btn btn-secondary"
                            onClick={onLogout}
                            style={{ padding: '0.35rem 0.75rem', fontSize: '0.85rem' }}
                        >
                            Logout
                        </button>
                    )}
                </div>
            )}
        </header>
    );
}
