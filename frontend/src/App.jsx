import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import StudentForm from './components/StudentForm';
import AdminDashboard from './components/AdminDashboard';
import AdminLogin from './components/AdminLogin';

// Base path is /data-form/ in both dev and production
const ADMIN_PATH = '/data-form/ravikishoretp';
const FORM_PATH = '/data-form/';

export default function App() {
    const [currentView, setCurrentView] = useState(() => {
        return window.location.pathname.startsWith('/data-form/ravikishoretp') ? 'admin' : 'form';
    });

    const [isAdminAuthed, setIsAdminAuthed] = useState(() => {
        return sessionStorage.getItem('admin_authenticated') === 'true';
    });

    useEffect(() => {
        const handlePopState = () => {
            if (window.location.pathname.startsWith('/data-form/ravikishoretp')) {
                setCurrentView('admin');
            } else {
                setCurrentView('form');
            }
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    const handleSetView = (view) => {
        setCurrentView(view);
        if (view === 'admin') {
            window.history.pushState({}, '', ADMIN_PATH);
        } else {
            window.history.pushState({}, '', FORM_PATH);
        }
    };

    const handleLogout = () => {
        sessionStorage.removeItem('admin_authenticated');
        setIsAdminAuthed(false);
    };

    return (
        <div className="app-container">
            <Header currentView={currentView} setCurrentView={handleSetView} isAdminAuthed={isAdminAuthed} onLogout={handleLogout} />
            <main className="main-content">
                {currentView === 'form' ? (
                    <StudentForm />
                ) : !isAdminAuthed ? (
                    <AdminLogin onLoginSuccess={() => setIsAdminAuthed(true)} />
                ) : (
                    <AdminDashboard onLogout={handleLogout} />
                )}
            </main>
        </div>
    );
}
