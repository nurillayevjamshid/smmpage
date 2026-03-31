import { StrictMode } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import DashboardLayout from './layouts/DashboardLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import ComposePost from './pages/ComposePost';

export default function App() {
  return (
    <BrowserRouter>
      <Toaster 
        position="top-center" 
        toastOptions={{
          style: {
            borderRadius: '16px',
            background: '#333',
            color: '#fff',
          },
        }} 
      />
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/:id" element={<ProjectDetail />} />
          <Route path="projects/:id/compose" element={<ComposePost />} />
          
          {/* Placeholder routes for sidebar links */}
          <Route path="scheduled" element={<div className="p-8 text-2xl font-bold">Scheduled Posts (Coming Soon)</div>} />
          <Route path="analytics" element={<div className="p-8 text-2xl font-bold">Analytics (Coming Soon)</div>} />
          <Route path="settings" element={<div className="p-8 text-2xl font-bold">Settings (Coming Soon)</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
