import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getMyProfile,
  updateMyProfile,
  getSavedJobs,
  saveJob,
  unsaveJob,
  getMySettings,
  updateMySettings,
  getMyInterviews,
  uploadResume,
} from '../../services/candidateService';

export const candidateKeys = {
  all: ['candidate'],
  profile: () => [...candidateKeys.all, 'profile'],
  savedJobs: () => [...candidateKeys.all, 'savedJobs'],
  settings: () => [...candidateKeys.all, 'settings'],
  interviews: () => [...candidateKeys.all, 'interviews'],
};

// ---- Profile ----

// ProfilePage.jsx
export function useMyProfile() {
  return useQuery({
    queryKey: candidateKeys.profile(),
    queryFn: getMyProfile,
  });
}

// ProfilePage.jsx "Save Changes"
export function useUpdateMyProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => updateMyProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: candidateKeys.profile() });
    },
  });
}

// ---- Saved Jobs ----

// SavedJobsPage.jsx
export function useSavedJobs() {
  return useQuery({
    queryKey: candidateKeys.savedJobs(),
    queryFn: getSavedJobs,
  });
}

// "Save this job" button — used on JobDetailPage.jsx / JobCard.jsx
export function useSaveJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (jobId) => saveJob(jobId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: candidateKeys.savedJobs() });
    },
  });
}

// "Remove from saved" button — SavedJobsPage.jsx
export function useUnsaveJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (jobId) => unsaveJob(jobId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: candidateKeys.savedJobs() });
    },
  });
}

// ---- Settings ----

// SettingsPage.jsx
export function useMySettings() {
  return useQuery({
    queryKey: candidateKeys.settings(),
    queryFn: getMySettings,
  });
}

export function useUpdateMySettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => updateMySettings(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: candidateKeys.settings() });
    },
  });
}

// ---- Interviews ----

// InterviewSchedulePage.jsx
// InterviewSchedulePage.jsx
export function useMyInterviews() {
  return useQuery({
    queryKey: candidateKeys.interviews(),
    queryFn: getMyInterviews,
  });
}

// ProfilePage.jsx "Upload/Replace Resume"
export function useUploadResume() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file) => uploadResume(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: candidateKeys.profile() });
    },
  });

}