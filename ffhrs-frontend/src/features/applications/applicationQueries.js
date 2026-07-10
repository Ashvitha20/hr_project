import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getMyApplicationById,
  getMyApplications,
  submitApplication,
} from '../../services/applicationService';

export const applicationKeys = {
  all: ['applications'],
  mine: () => [...applicationKeys.all, 'mine'],
  detail: (id) => [...applicationKeys.all, 'detail', id],
};

export function useMyApplications() {
  return useQuery({
    queryKey: applicationKeys.mine(),
    queryFn: getMyApplications,
  });
}

export function useMyApplicationDetail(applicationId) {
  return useQuery({
    queryKey: applicationKeys.detail(applicationId),
    queryFn: () => getMyApplicationById(applicationId),
    enabled: Boolean(applicationId),
  });
}

export function useSubmitApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ jobId, applicationData, resumeFile, coverLetterFile, onUploadProgress }) =>
      submitApplication(jobId, applicationData, resumeFile, coverLetterFile, onUploadProgress),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: applicationKeys.mine() });
    },
  });
}
