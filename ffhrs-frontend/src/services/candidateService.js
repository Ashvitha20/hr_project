import axiosClient from '../api/axiosClient';

/**
 * Candidate self-service API layer.
 * Backs ProfilePage.jsx, SavedJobsPage.jsx, InterviewSchedulePage.jsx, SettingsPage.jsx.
 */

// ---- Profile ----

export async function getMyProfile() {
  const { data } = await axiosClient.get('/candidates/me/profile');
  return data;
}

export async function updateMyProfile(payload) {
  const { data } = await axiosClient.put('/candidates/me/profile', payload);
  return data;
}

// ---- Saved Jobs ----

export async function getSavedJobs() {
  const { data } = await axiosClient.get('/candidates/me/saved-jobs');
  return data;
}

export async function saveJob(jobId) {
  const { data } = await axiosClient.post(`/candidates/me/saved-jobs/${jobId}`);
  return data;
}

export async function unsaveJob(jobId) {
  const { data } = await axiosClient.delete(`/candidates/me/saved-jobs/${jobId}`);
  return data;
}

// ---- Settings ----

export async function getMySettings() {
  const { data } = await axiosClient.get('/candidates/me/settings');
  return data;
}

export async function updateMySettings(payload) {
  const { data } = await axiosClient.put('/candidates/me/settings', payload);
  return data;
}

// ---- Interviews ----

export async function getMyInterviews() {
  const { data } = await axiosClient.get('/candidates/me/interviews');
  return data;
}
export async function uploadResume(file) {
  const formData = new FormData();
  formData.append('resume', file);
  const { data } = await axiosClient.put('/candidates/me/resume', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}