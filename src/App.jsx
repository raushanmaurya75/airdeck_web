import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AuthenticatedNavbar from './components/AuthenticatedNavbar';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import DisplayReceiver from './pages/DisplayReceiver';
import DisplaysWorkspace from './pages/DisplaysWorkspace';
import LiveStudioController from './pages/LiveStudioController';
import MediaLibrary from './pages/MediaLibrary';
import SchedulesWorkspace from './pages/SchedulesWorkspace';
import ActiveRoom from './pages/ActiveRoom';

function AuthenticatedShell({ children, onOpenPairModal }) {
  return (
    <div className="flex flex-col min-h-screen bg-page text-primary-token transition-colors">
      <AuthenticatedNavbar onOpenPairModal={onOpenPairModal} />
      <div className="flex-1">{children}</div>
    </div>
  );
}

function AuthenticatedWorkspace() {
  const [isPairModalOpen, setIsPairModalOpen] = useState(false);

  return (
    <AuthenticatedShell onOpenPairModal={() => setIsPairModalOpen(true)}>
      <Routes>
        <Route
          path=""
          element={
            <DisplaysWorkspace
              isPairModalOpen={isPairModalOpen}
              setIsPairModalOpen={setIsPairModalOpen}
            />
          }
        />
        <Route
          path="displays"
          element={
            <DisplaysWorkspace
              isPairModalOpen={isPairModalOpen}
              setIsPairModalOpen={setIsPairModalOpen}
            />
          }
        />

        <Route path="display/:id" element={<LiveStudioController />} />

        <Route path="media" element={<MediaLibrary />} />

        <Route path="schedules" element={<SchedulesWorkspace />} />

        <Route path="room/:code" element={<ActiveRoom />} />
      </Routes>
    </AuthenticatedShell>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LandingPage />} />

              <Route path="/login" element={<Login />} />

              <Route path="/receiver" element={<DisplayReceiver />} />

              <Route
                path="/console/*"
                element={
                  <ProtectedRoute>
                    <AuthenticatedWorkspace />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/display/:id"
                element={
                  <ProtectedRoute>
                    <Navigate to="/console/display/:id" replace />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/room/:code"
                element={
                  <ProtectedRoute>
                    <Navigate to="/console/room/:code" replace />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
