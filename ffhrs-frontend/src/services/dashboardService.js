import axiosClient from '../api/axiosClient';

/**
 * Dashboard summary API layer.
 * Backs the stat cards on CandidateDashboard.jsx, HRDashboard.jsx, and AdminDashboard.jsx.
 */

// GET /candidates/me/summary — CandidateDashboard.jsx
export async function getCandidateDashboardSummary() {
  const { data } = await axiosClient.get('/candidates/me/summary');
  return data;
}

// GET /hr/dashboard/summary — HRDashboard.jsx
// (also reused by AdminDashboard.jsx, mounted at /admin/dashboard/summary on the backend)
export async function getHRDashboardSummary() {
  const { data } = await axiosClient.get('/hr/dashboard/summary');
  return data;
}

// GET /admin/dashboard/summary — AdminDashboard.jsx
export async function getAdminDashboardSummary() {
  const { data } = await axiosClient.get('/admin/dashboard/summary');
  return data;
}