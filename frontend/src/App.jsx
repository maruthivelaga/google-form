import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import StudentForm from './components/StudentForm';
import AdminDashboard from './components/AdminDashboard';

// Base path is /data-form/ in both dev and production
const ADMIN_PATH = '/data-form/ravikishoretp';
const FORM_PATH = '/data-form/';

export default function App() {
    const [currentView, setCurrentView] = useState(() => {
        return window.location.pathname.startsWith('/data-form/ravikishoretp') ? 'admin' : 'form';
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

    return (
        <div className="app-container">
            <Header currentView={currentView} setCurrentView={handleSetView} />
            <main className="main-content">
                {currentView === 'form' ? (
                    <StudentForm />
                ) : (
                    <AdminDashboard />
                )}
            </main>
        </div>
    );
}
