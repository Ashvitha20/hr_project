import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getApplications,
  getApplicantsForJob,
  getApplicationById,
  updateApplicationStatus,
  getInterviewsForApplication,
  scheduleInterview,
  rescheduleInterview,
  completeInterview,
  cancelInterview,
  getAllInterviews,
} from '../../services/hrApplicationService';

export const hrApplicationKeys = {
  all: ['hrApplications'],
  list: (params) => [...hrApplicationKeys.all, 'list', params],
  byJob: (jobId, params) => [...hrApplicationKeys.all, 'byJob', jobId, params],
  detail: (applicationId) => [...hrApplicationKeys.all, 'detail', applicationId],
  interviews: (applicationId) => [...hrApplicationKeys.all, 'interviews', applicationId],
  allInterviews: (params) => [...hrApplicationKeys.all, 'all-interviews', params],
};

// ApplicantsListPage.jsx
export function useApplications(params = {}) {
  return useQuery({
    queryKey: hrApplicationKeys.list(params),
    queryFn: () => getApplications(params),
    keepPreviousData: true,
  });
}

// "View Applicants" link from ManageJobsPage.jsx -> /hr/jobs/:jobId/applicants
export function useApplicantsForJob(jobId, params = {}) {
  return useQuery({
    queryKey: hrApplicationKeys.byJob(jobId, params),
    queryFn: () => getApplicantsForJob(jobId, params),
    enabled: Boolean(jobId),
    keepPreviousData: true,
  });
}

// ApplicantDetailPage.jsx
export function useApplicationDetail(applicationId) {
  return useQuery({
    queryKey: hrApplicationKeys.detail(applicationId),
    queryFn: () => getApplicationById(applicationId),
    enabled: Boolean(applicationId),
  });
}

export function useUpdateApplicationStatus(applicationId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ status, comment }) => updateApplicationStatus(applicationId, { status, comment }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: hrApplicationKeys.all });
    },
  });
}

// ---- Interviews ----

// InterviewsPage.jsx — all scheduled interviews across applications
export function useAllInterviews(params = {}) {
  return useQuery({
    queryKey: hrApplicationKeys.allInterviews(params),
    queryFn: () => getAllInterviews(params),
    keepPreviousData: true,
  });
}

export function useInterviewsForApplication(applicationId) {
  return useQuery({
    queryKey: hrApplicationKeys.interviews(applicationId),
    queryFn: () => getInterviewsForApplication(applicationId),
    enabled: Boolean(applicationId),
  });
}

export function useScheduleInterview(applicationId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => scheduleInterview(applicationId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: hrApplicationKeys.all });
    },
  });
}

export function useRescheduleInterview(applicationId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ interviewId, payload }) => rescheduleInterview(interviewId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: hrApplicationKeys.all });
      if (applicationId) {
        queryClient.invalidateQueries({ queryKey: hrApplicationKeys.interviews(applicationId) });
      }
    },
  });
}

export function useCompleteInterview(applicationId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ interviewId, notes }) => completeInterview(interviewId, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: hrApplicationKeys.all });
      if (applicationId) {
        queryClient.invalidateQueries({ queryKey: hrApplicationKeys.interviews(applicationId) });
      }
    },
  });
}

export function useCancelInterview(applicationId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ interviewId, reason }) => cancelInterview(interviewId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: hrApplicationKeys.all });
      if (applicationId) {
        queryClient.invalidateQueries({ queryKey: hrApplicationKeys.interviews(applicationId) });
      }
    },
  });
}
// InterviewsPage.jsx — all interviews across applications
