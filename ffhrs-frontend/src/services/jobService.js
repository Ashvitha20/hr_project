import axiosClient from '../api/axiosClient';

/**
 * Jobs API layer.
 * Public endpoints back JobListingPage/JobDetailPage (GET /jobs, /jobs/filters, /jobs/:jobId).
 * Management endpoints back HR/Admin "Manage Jobs" (GET/POST /hr/jobs, PUT/PATCH/DELETE /hr/jobs/:jobId).
 * Note: /admin/jobs is mounted to the same managementRouter on the backend and both
 * hr/recruiter/admin roles are authorized on /hr/jobs, so a single base path works for both portals.
 */

// ---- Public (Careers page) ----
export async function getPublicJobs(params = {}) {
  const { data } = await axiosClient.get('/jobs', { params });
  return data;
}

export async function getPublicJobFilters() {
  const { data } = await axiosClient.get('/jobs/filters');
  return data;
}

export async function getPublicJobById(jobId) {
  const { data } = await axiosClient.get(`/jobs/${jobId}`);
  return data;
}

// ---- HR/Admin management ----
export async function getManagedJobs(params = {}) {
  const { data } = await axiosClient.get('/hr/jobs', { params });
  return data;
}

export async function createJob(payload) {
  const { data } = await axiosClient.post('/hr/jobs', payload);
  return data;
}

export async function updateJob(jobId, payload) {
  const { data } = await axiosClient.put(`/hr/jobs/${jobId}`, payload);
  return data;
}

export async function closeJob(jobId) {
  const { data } = await axiosClient.patch(`/hr/jobs/${jobId}/close`);
  return data;
}

export async function reopenJob(jobId) {
  const { data } = await axiosClient.patch(`/hr/jobs/${jobId}/reopen`);
  return data;
}

export async function deleteJob(jobId) {
  const { data } = await axiosClient.delete(`/hr/jobs/${jobId}`);
  return data;
}