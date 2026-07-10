import axiosClient from '../api/axiosClient';

/**
 * HR/Admin Applicants API layer.
 * Backs the "/hr/applicants" and "/admin/applications" screens.
 * Note: like jobService.js, /hr and /admin both authorize hr/recruiter/admin
 * roles on the same backend routers, so a single base path works for both portals.
 */

// GET /hr/applications?jobId=&status=&search=&page=&limit=
export async function getApplications(params = {}) {
  const { data } = await axiosClient.get('/hr/applications', { params });
  return data;
}

// GET /hr/jobs/:jobId/applicants — "View Applicants" from Manage Jobs
export async function getApplicantsForJob(jobId, params = {}) {
  const { data } = await axiosClient.get(`/hr/jobs/${jobId}/applicants`, { params });
  return data;
}

// GET /hr/applications/:applicationId — full candidate profile
// (backend auto-flips status Applied -> Application Viewed on first open)
export async function getApplicationById(applicationId) {
  const { data } = await axiosClient.get(`/hr/applications/${applicationId}`);
  return data;
}

// PATCH /hr/applications/:applicationId/status — Shortlist / Move to Next Round /
// Select / Reject / any other status transition, with an optional recruiter comment.
export async function updateApplicationStatus(applicationId, { status, comment }) {
  const { data } = await axiosClient.patch(`/hr/applications/${applicationId}/status`, {
    status,
    comment,
  });
  return data;
}

// ---- Interview scheduling (same application detail screen) ----

// GET /hr/interviews?status=&page=&limit= — InterviewsPage.jsx (all interviews, not scoped to one application)
export async function getAllInterviews(params = {}) {
  const { data } = await axiosClient.get('/hr/interviews', { params });
  return data;
}

// GET /hr/applications/:applicationId/interviews
export async function getInterviewsForApplication(applicationId) {
  const { data } = await axiosClient.get(`/hr/applications/${applicationId}/interviews`);
  return data;
}

// POST /hr/applications/:applicationId/interviews — "Schedule Interview"
export async function scheduleInterview(applicationId, payload) {
  const { data } = await axiosClient.post(`/hr/applications/${applicationId}/interviews`, payload);
  return data;
}

// PATCH /hr/interviews/:interviewId — reschedule
export async function rescheduleInterview(interviewId, payload) {
  const { data } = await axiosClient.patch(`/hr/interviews/${interviewId}`, payload);
  return data;
}

// PATCH /hr/interviews/:interviewId/complete
export async function completeInterview(interviewId, notes) {
  const { data } = await axiosClient.patch(`/hr/interviews/${interviewId}/complete`, { notes });
  return data;
}

// PATCH /hr/interviews/:interviewId/cancel
export async function cancelInterview(interviewId, reason) {
  const { data } = await axiosClient.patch(`/hr/interviews/${interviewId}/cancel`, { reason });
  return data;
}
