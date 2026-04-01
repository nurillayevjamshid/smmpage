import { StrictMode } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import DashboardLayout from './layouts/DashboardLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import ComposePost from './pages/ComposePost';
import Accounts from './pages/Accounts';
import Media from './pages/Media';
import Posts from './pages/Posts';
import Settings from './pages/Settings';
import Admin from './pages/Admin';

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
          <Route path="accounts" element={<Accounts />} />
          <Route path="media" element={<Media />} />
          <Route path="posts" element={<Posts />} />
          <Route path="settings" element={<Settings />} />
          <Route path="admin" element={<Admin />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

