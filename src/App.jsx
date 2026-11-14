import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import ActiveRoom from './pages/ActiveRoom';
import CreateRoomModal from './components/CreateRoomModal';

export default function App() {
  const [isNavCreateOpen, setIsNavCreateOpen] = useState(false);

  return (
    <ThemeProvider>
      <ToastProvider>
        <BrowserRouter>
          <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
            <Navbar onOpenCreateModal={() => setIsNavCreateOpen(true)} />
            <div className="flex-1">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/room/:code" element={<ActiveRoom />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
            <Footer />

            {/* Global Navbar Quick-Create Modal */}
            <CreateRoomModal
              isOpen={isNavCreateOpen}
              onClose={() => setIsNavCreateOpen(false)}
            />
          </div>
        </BrowserRouter>
      </ToastProvider>
    </ThemeProvider>
  );
}
